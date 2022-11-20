import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import { send_email } from 'App/Services/MailService';
import { GenerateValidationCode } from 'App/Services/Utils';
import { EditUserValidator, RegisterUserValidator, WalletValidator } from 'App/Validators/UserValidator';
import { DateTime } from 'luxon';
import Env from '@ioc:Adonis/Core/Env';
import Wallet from 'App/Models/Wallet';

export default class UsersController
{
    public async register ({ request, response }: HttpContextContract)
    {
        const { email, password, name } = await request.validate(RegisterUserValidator);

        const user = await User.create({ email, password, name });

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
        const { wallet } = await request.validate(WalletValidator)
            , user = await auth.authenticate()
            , new_wallet = new Wallet();

        new_wallet.merge({
            address: wallet,
            user_id: user.id,
        }).save();

        return response.ok({
            message: 'User updated successfully',
            user: auth?.user,
        });
    }
}
