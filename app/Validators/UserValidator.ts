import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import { validationMessage } from '../../resources/locales/en-US/validation';

export class RegisterUserValidator
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

export class EditUserValidator
{
    constructor (protected ctx: HttpContextContract){}

    public schema = schema.create({
        name: schema.string.optional({}, [rules.required()]),
        email: schema.string.optional({}, [
            rules.email(),
            rules.unique({ table: 'users', column: 'email' }),
        ]),
        cpf: schema.string.optional({}, []),
        phone: schema.string.optional({}, []),
        cep: schema.string.optional({}, []),
        number: schema.string.optional({}, []),
        complement: schema.string.optional({}, []),
    });

    public messages = validationMessage;
    public cacheKey = this.ctx?.routeKey;
}

export class WalletValidator
{
    constructor (protected ctx: HttpContextContract){}

    public schema = schema.create({
        wallet: schema.string.optional({}, [rules.required()]),
    });

    public messages = validationMessage;
    public cacheKey = this.ctx?.routeKey;
}
