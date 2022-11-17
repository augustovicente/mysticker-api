import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import { send_email } from 'App/Services/MailService';
import { GenerateValidationCode } from 'App/Services/Utils';
import { RegisterValidator } from 'App/Validators/UserValidator';
import Env from '@ioc:Adonis/Core/Env';
import { DateTime } from 'luxon';

export default class UsersController
{
    public async register ({ request, response }: HttpContextContract)
    {
        const { email, password, name } = await request.validate(RegisterValidator);

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
}
