import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import { validationMessage } from 'resources/locales/en-US/validation';

export class LoginValidator
{
    constructor (protected ctx: HttpContextContract){}

    public schema = schema.create({
        email: schema.string.optional([
            rules.trim(),
            rules.email(),
            rules.exists({ column: 'email', table: 'users' }),
        ]),
        password: schema.string([rules.required()]),
    });

    public messages = validationMessage;
    public cacheKey = this.ctx?.routeKey;
}

export class ResetPasswordValidator
{
    constructor (protected ctx: HttpContextContract)
    {}

    public schema = schema.create({
        password: schema.string({ trim: true }, [rules.required()]),
    });

    public messages = validationMessage;
    public cacheKey = this.ctx?.routeKey
}