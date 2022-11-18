import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import ValidationCode from 'App/Models/ValidationCode';
import { send_email } from 'App/Services/MailService';
import { GenerateValidationCode } from 'App/Services/Utils';
import { ForgotPasswordValidator, LoginValidator, ResetPasswordValidator } from 'App/Validators/AuthValidator';
import { DateTime } from 'luxon';
import Hash from '@ioc:Adonis/Core/Hash';
import Env from '@ioc:Adonis/Core/Env';

export default class AuthController
{
    public async login ({ auth, request, response }: HttpContextContract)
    {
        const { email, password } = await request.validate(LoginValidator);
        let user: User | null = null,
            token: Record<string, any> | null = null;

        user = await User.findByOrFail('email', email);
        // verificando se o email foi confirmado
        if(user.email_verified)
        {
            token = await auth.attempt(email, password);
            return response.send({ user, token: token?.token });
        }
        else
        {
            return response.methodNotAllowed({ message: 'Usuário não verificado' });
        }
    }

    public async verify_email ({ params, response }: HttpContextContract)
    {
        const { code } = params;
        // verificando se o email foi confirmado
        if(code)
        {
            const _validation = await ValidationCode.query()
                .where('code', code)
                .andWhere('expiration_date_time', '>', new Date())
                .first();

            if(_validation)
            {
                const user = await User.findOrFail(_validation.user_id);
                user.email_verified = true;
                await user.save();
                return response.ok({ message: 'Email verified successfully' });
            }
            else
            {
                return response.notFound({ error: 'Code not found or expired' });
            }
        }
        else
        {
            return response.notFound({ error: 'Code not found' });
        }
    }

    public async reset_password_by_link ({ params, response, request }: HttpContextContract)
    {
        const { code } = params;
        const { password } = await request.validate(ResetPasswordValidator);
        // verificando se o email foi confirmado
        if(code)
        {
            const _validation = await ValidationCode.query()
                .where('code', code)
                .andWhere('expiration_date_time', '>', new Date())
                .first();

            if(_validation)
            {
                const user = await User.findOrFail(_validation.user_id);
                user.password = password;
                user.email_verified = true;
                await user.save();
                return response.ok({ message: 'Email verified successfully' });
            }
            else
            {
                return response.notFound({ error: 'Code not found or expired' });
            }
        }
        else
        {
            return response.notFound({ error: 'Code not found' });
        }
    }

    /**
     * @description Altera a senha do usuário logado
     */
    public async reset_password ({ request, response, params }: HttpContextContract)
    {
        const { password } = await request.validate(ResetPasswordValidator)
            , user = await User.findOrFail(params.id),

            // Caso a senha seja igual a anterior será retornado um erro
            isSamePassword = await Hash.verify(user.password, password);

        if (isSamePassword)
        {
            return response.internalServerError({
                status: 'Error',
                errorCode: 'IS_THE_SAME',
            });
        }
        else
        {
            await user.merge({ password, email_verified: true }).save();

            return response.ok({ status: 'Password has been updated' });
        }
    }

    /**
     * @description Faz uma autenticação do usuários pelo token
     * e retorna seus dados salvos.
     */
    public async get_authenticated_user ({ auth, response }: HttpContextContract)
    {
        const user = await auth.authenticate();

        return response.send(user);
    }

    public async forgot_password ({ request, response }: HttpContextContract)
    {
        const { email } = await request.validate(ForgotPasswordValidator)
        const user = await User.findByOrFail('email', email);

        // criando o código de validação
        let the_code = await GenerateValidationCode();
        // salvando o código de validação
        const validation_code = await user.related('validation_codes').create({
            code: the_code,
            expiration_date_time: DateTime.now().plus({ hours: 2 }),
        });
        let url_validation = `https://mysticker.io/reset-pwd/${validation_code.code}`;
        // enviando o email de confirmação
        send_email(
            email,
            'Link de recuperação',
            { verification_url: url_validation },
            Env.get('SENDGRID_TEMPLATE_RESET_PASSWORD')
        );

        return response.ok({ message: 'Email sent successfully' });
    }
}
