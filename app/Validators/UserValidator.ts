import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import { validationMessage } from '../../resources/locales/en-US/validation';

export class RegisterValidator
{
    constructor (protected ctx: HttpContextContract){}

    public schema = schema.create({
        name: schema.string({}, [rules.required()]),
        email: schema.string({}, [
            rules.required(),
            rules.unique({ table: 'users', column: 'email' }),
            rules.email(),
        ]),
        password: schema.string([rules.required()]),
    });

    public messages = validationMessage;
    public cacheKey = this.ctx?.routeKey;
}
