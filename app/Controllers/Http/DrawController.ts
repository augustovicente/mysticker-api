import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Wallet from 'App/Models/Wallet';
import { draw_service } from 'App/Services/DrawService';
import { check_if_has_all_from_country, Sticker } from 'App/Services/StickerService';
import { burn_for_mint, mint_package } from 'App/Services/Web3Service';
import { OpenPackageValidator, PasteStickerValidator } from 'App/Validators/DrawValidator';
export default class DrawController
{
    public async open_package ({ auth, request, response }: HttpContextContract)
    {
        const user = await auth.authenticate();
        const { address, package_type, amount } = await request.validate(OpenPackageValidator);
        // check if wallet is vinculated
        
        const wallet = await Wallet.query()
            .where('user_id', user.id)
            .andWhereRaw(`address ilike '%${address}%'`)
            .firstOrFail()
        
        if(!!wallet)
        {
            let stickers_drawed:Sticker[] = [];
            for(let i = 0; i < amount; i++)
            {
                let the_draw = await draw_service(package_type as 1|2|3);
                stickers_drawed = [
                    ...stickers_drawed,
                    ...the_draw
                ];
            }

            await mint_package(package_type as 1|2|3, address, stickers_drawed.map(sticker => sticker.id), amount);

            return response.status(200).send({ stickers_drawed });
        }
        else
        {
            return response.status(400).send({ message: 'Wallet not vinculated' });
        }
    }

    public async paste_sticker ({ auth, request, response }: HttpContextContract)
    {
        const user = await auth.authenticate();

        const { address, country_id } = await request.validate(PasteStickerValidator);

        // check if wallet is vinculated
        const wallet = await Wallet.query()
            .where('user_id', user.id)
            .andWhereRaw(`address ilike '%${address}%'`)
            .firstOrFail()
        
        if(!!wallet)
        {
            let has_all_from_country = await check_if_has_all_from_country(country_id, address);
            if(has_all_from_country)
            {
                // burn stickers and mint country
                await burn_for_mint(has_all_from_country, address, [country_id]);

                return response.status(200).send({ message: 'Stickers burn and country minted' });
            }
            else
            {
                return response.status(400).send({ message: 'You need to have all stickers from this country' });
            }
        }
        else
        {
            return response.status(400).send({ message: 'Wallet not vinculated' });
        }
    }
}
