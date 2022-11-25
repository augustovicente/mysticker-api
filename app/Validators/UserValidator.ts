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

    public refs = schema.refs({
        id: this.ctx.auth.user?.id,
    });

    public schema = schema.create({
        name: schema.string.optional({}, []),
        email: schema.string.optional({}, [
            rules.unique({
                table: 'users',
                column: 'email',
                whereNot: { id: this.refs.id },
            }),
            rules.email(),
            rules.trim()
        ]),
        cpf: schema.string.optional({}, [rules.trim()]),
        full_number: schema.string.optional({}, [rules.trim()]),
        address_zip_code: schema.string.optional({}, [rules.trim()]),
        address_number: schema.string.optional({}, [rules.trim()]),
        address_complement: schema.string.optional({}, []),
    });

    public messages = validationMessage;
    public cacheKey = this.ctx?.routeKey;
}

export class WalletValidator
{
    constructor (protected ctx: HttpContextContract){}

    public schema = schema.create({
        wallet: schema.string({}, [rules.required()]),
    });

    public messages = validationMessage;
    public cacheKey = this.ctx?.routeKey;
}
