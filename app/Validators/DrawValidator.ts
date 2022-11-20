import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import { validationMessage } from '../../resources/locales/en-US/validation';

export class OpenPackageValidator
{
    constructor (protected ctx: HttpContextContract){}

    public schema = schema.create({
        address: schema.string({}, [rules.required()]),
        package_type: schema.number([rules.required()]),
    });

    public messages = validationMessage;
    public cacheKey = this.ctx?.routeKey;
}

export class PasteStickerValidator
{
    constructor (protected ctx: HttpContextContract){}

    public schema = schema.create({
        country_id: schema.number([rules.required()]),
        address: schema.string({}, [rules.required()]),
    });

    public messages = validationMessage;
    public cacheKey = this.ctx?.routeKey;
}