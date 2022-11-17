import ValidationCode from "App/Models/ValidationCode";

export const GenerateValidationCode = async () =>
{
    let the_code:string = Math.floor(100000 + Math.random() * 900000).toString();
    // checando se ele é único
    let is_unique:boolean = false;
    while(!is_unique)
    {
        const _validation = await ValidationCode.query()
            .where('code', the_code)
            .andWhere('expiration_date_time', '>', new Date())
            .first();

        if(_validation)
        {
            the_code = Math.floor(100000 + Math.random() * 900000).toString();
        }
        else
        {
            is_unique = true;
        }
    }
    return the_code;
}
