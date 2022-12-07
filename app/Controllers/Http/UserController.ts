import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import { send_email } from 'App/Services/MailService';
import { GenerateValidationCode } from 'App/Services/Utils';
import { BuyPackageValidator, EditUserValidator, RedeemValidator, RegisterUserValidator, WalletValidator } from 'App/Validators/UserValidator';
import { DateTime } from 'luxon';
import Env from '@ioc:Adonis/Core/Env';
import Prize from 'App/Models/Prize';
import Wallet from 'App/Models/Wallet';
import { get_sticker_balance } from 'App/Services/Web3Service';
import Affiliated from 'App/Models/Affiliated';
import PackageBuy from 'App/Models/PackageBuy';

export default class UsersController
{
    public async register ({ request, response }: HttpContextContract)
    {
        const { email, password, name, affiliate_code } = await request.validate(RegisterUserValidator);

        let affiliated: Affiliated | null = null;
        if(affiliate_code)
        {
            affiliated = await Affiliated.findBy('code', affiliate_code);

            // if(!affiliated)
            // {
            //     return response.status(400).send({ message: 'Affiliated code not found' });
            // }
        }

        const user = await User.create({ email, password, name, affiliated_id: affiliated?.id });

        // criando o código de validação
        let the_code = await GenerateValidationCode();
        // salvando o código de validação
        const validation_code = await user.related('validation_codes').create({
            code: the_code,
            expiration_date_time: DateTime.now().plus({ hours: 2 }),
        });
        let url_validation = `https://mysticker.io/validation/${validation_code.code}`;
        // enviando o email de confirmação
        send_email(
            email,
            'Verificação de conta',
            { verification_url: url_validation },
            Env.get('SENDGRID_TEMPLATE_VERIFICATION_ACCOUNT')
        );

        return response.ok({
            message: 'User created successfully',
            user,
        });
    }

    public async edit_data ({ request, response, auth }: HttpContextContract)
    {
        const {
            name,
            email,
            address_zip_code,
            address_complement,
            address_number,
            cpf,
            full_number,
        } = await request.validate(EditUserValidator);

        await auth.user!.merge({
            name,
            email,
            address_zip_code,
            address_complement,
            address_number,
            cpf,
            full_number,
        }).save();

        return response.ok({
            message: 'User updated successfully',
            user: auth?.user,
        });
    }

    public async vinculate_wallet ({ request, response, auth }: HttpContextContract)
    {
        const { wallet } = await request.validate(WalletValidator);

        const alreadyVinculated = await auth.user!
            .related('wallets')
            .query()
            .select('id')
            .where('address', wallet)
            .first();

        if (alreadyVinculated?.id) {
            return response.ok({
                message: 'Wallet already vinculated',
            });
        }

        try {
            await auth.user!.related('wallets').firstOrCreate({
                address: wallet,
            });

            return response.ok({
                message: 'Wallet vinculated successfully'
            });
        } catch (error) {
            return response.internalServerError({
                message: 'Error vinculating wallet',
            })
        }
    }

    public async unvinculate_wallet ({ request, response, auth }: HttpContextContract)
    {
        const { wallet } = await request.validate(WalletValidator);

        try {
            await auth.user!.related('wallets').query().where('address', wallet).delete();

            return response.ok({
                message: 'Wallet unvinculated successfully'
            });
        } catch (error) {
            return response.internalServerError({
                message: 'Error unvinculating wallet',
            })
        }
    }

    public async has_redeem ({ params, response, auth }: HttpContextContract)
    {
        const prize_type = Number(params.prize_type);

        if(![1,2,3,4,5,6].includes(prize_type))
        {
            return response.badRequest({
                message: 'Invalid prize type',
            });
        }

        const user = await auth.authenticate();
        const has_redeem = await Prize.query()
            .where('user_id', user.id)
            .andWhere('type', prize_type)
            .firstOrFail();

        return response.ok({
            has_redeem: !!has_redeem,
            ...(!!has_redeem)?
            {
                redeem_status: has_redeem.redeem_status,
                redeem_last_update: has_redeem.redeem_last_update,
                redeem_info: has_redeem.redeem_info,
            }:null,
        });
    }

    public async redeem ({ response, auth, request }: HttpContextContract)
    {
        const user = await auth.authenticate();
        const { size, type, wallet } = await request.validate(RedeemValidator);

        // check if user has this wallet
        const has_wallet = await Wallet.query()
            .select('id')
            .where('user_id', user.id)
            .andWhere('address', wallet)
            .first();

        if(!has_wallet)
        {
            return response.badRequest({
                message: 'Wallet not vinculated to this user',
            });
        }

        // check if user has already redeemed this prize
        const has_redeem = await Prize.query()
            .select('id')
            .where('user_id', user.id)
            .andWhere('type', type)
            .first();

        if(has_redeem)
        {
            return response.badRequest({
                message: 'User already redeemed this prize',
            });
        }

        // check if user has required nfts to redeem this prize
        let required_nfts:number[] = [];
        switch (type)
        {
            case 1:
                required_nfts = [12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168, 180, 192, 204, 216, 228, 240, 252, 264, 276, 288, 300, 312, 324, 336, 348, 360, 372, 384];
                break;
            case 2:
                required_nfts = [264, 216, 84, 132];
                break;
            case 3:
                required_nfts = [300, 108, 24, 372];
                break;
            case 4:
                required_nfts = [336, 360, 276, 36, 192];
                break;
            case 5:
                required_nfts = [120, 384, 72, 240, 12];
                break;
            case 6:
                required_nfts = [228, 168, 252, 288, 180, 204, 156, 48, 60, 96, 144, 348, 324, 312];
                break;
        }

        let balances = await get_sticker_balance(wallet, required_nfts);
        let has_all_nfts = true;
        for (let i = 0; i < balances.length; i++)
        {
            if(balances[i] < 1)
            {
                has_all_nfts = false;
                break;
            }
        }

        if(!has_all_nfts)
        {
            return response.badRequest({
                message: 'User does not have required nfts to redeem this prize',
            });
        }

        // create prize
        const prize = await Prize.create({
            user_id: user.id,
            type,
            size,
            redeem_info: 'Solicitado',
            wallet_id: has_wallet.id,
            redeem_status: 1, // 1 processing - 2 sent
            redeem_last_update: DateTime.now(),
        });

        return response.ok({
            message: 'Prize redeemed successfully',
            prize,
        });
    }

    public async buy_package ({ response, auth, request }: HttpContextContract)
    {
        const user = await auth.authenticate();
        const { hash, wallet } = await request.validate(BuyPackageValidator);

        try {

            // check if user has this wallet
            const has_wallet = await Wallet.query()
                .where('user_id', user.id)
                .andWhere('address', wallet)
                .first();

            if(!has_wallet)
            {
                return response.badRequest({
                    message: 'Wallet not vinculated to this user',
                });
            }

            // salvando a compra
            await PackageBuy.create({
                user_id: user.id,
                hash_transaction: hash,
            });

            return response.ok({
                message: 'Package buy saved successfully',
            });
        }
        catch (error)
        {
            return response.internalServerError({
                message: 'Error saving package buy',
            });
        }
    }
}
