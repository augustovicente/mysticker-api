import Hash from '@ioc:Adonis/Core/Hash';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import { LoginValidator, ResetPasswordValidator } from 'App/Validators/AuthValidator';

export default class AuthController
{
    public async login ({ auth, request, response }: HttpContextContract)
    {
        const { email, password } = await request.validate(LoginValidator);
        let user: User | null = null,
            token: Record<string, any> | null = null;

        if(email)
        {
            user = await User.findByOrFail('email', email);
            token = await auth.attempt(email, password);
        }

        return response.send({ user, token: token?.token });
    }

    /**
     * @description Faz uma autenticação do usuários pelo token
     * e retorna seus dados salvos.
     */
    public async authenticateUser ({ auth, response }: HttpContextContract)
    {
        const user = await auth.authenticate();

        return response.send(user);
    }

    /**
     * @description Altera a senha do usuário,
     * caso não tenha data do primeiro acesso, é marcada uma data nova.
     */
    public async resetPassword ({ request, response, params }: HttpContextContract)
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
            await user.merge({ password }).save();

            return response.ok({ status: 'Password has been updated' });
        }
    }
}
