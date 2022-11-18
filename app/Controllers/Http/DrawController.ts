import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import { send_email } from 'App/Services/MailService';
import { GenerateValidationCode } from 'App/Services/Utils';
import { RegisterUserValidator } from 'App/Validators/UserValidator';
import { DateTime } from 'luxon';
import Env from '@ioc:Adonis/Core/Env';

export default class UsersController
{
    public async draw ({ auth, response }: HttpContextContract)
    {
        

        return response.ok({
            message: 'User created successfully',
        });
    }
}
