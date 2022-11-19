import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Wallet from 'App/Models/Wallet';
import { draw_service } from 'App/Services/DrawService';
import { mint_package } from 'App/Services/Web3Service';
import { OpenPackageValidator } from 'App/Validators/OpenPackageValidator';
export default class DrawController
{
    public async open_package ({ auth, request, response }: HttpContextContract)
    {
        const user = await auth.authenticate();
        const { address, package_type } = await request.validate(OpenPackageValidator);
        // check if wallet is vinculated
        console.log(address, user.id);
        
        const wallet = await Wallet.query()
            .where('user_id', user.id)
            .andWhereRaw(`address ilike '%${address}%'`)
            .firstOrFail()
        
        if(!!wallet)
        {
            let stickers_drawed = await draw_service(package_type as 1|2|3);
            console.log(stickers_drawed);

            let result = await mint_package(package_type as 1|2|3, address, stickers_drawed.map(sticker => sticker.id));
        }
        else
        {
            return response.status(400).send({ message: 'Wallet not vinculated' });
        }
    }
}
