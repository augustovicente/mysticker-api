import Env from '@ioc:Adonis/Core/Env';
import sgMail from '@sendgrid/mail';

export const send_email = async (email_to:string, subject:string, variable_obj:any, templateId) =>
{
    sgMail.setApiKey(Env.get('SENDGRID_API_KEY'));

    try
    {
        await sgMail.send({
            from: 'noreply@mysticker.io',
            to: email_to,
            subject: subject,
            templateId,
            dynamicTemplateData: {
                variable_obj
            },
        });
    }
    catch (error)
    {
        console.error(error);
        if (error.response)
        {
            return error.response.body.errors[0];
        }
    }
};
