import * as postmark from 'postmark';

const emailClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY!);

const Emails = {
  welcomeVerify: {
    templateAlias: 'welcome-verify-email',
    messageStreamID: 'verify-email',
  },
  contactRequest: {
    templateAlias: 'contact-request-email',
    messageStreamID: 'contact-submissions',
  },
};

export const sendVerifyEmailEmail = async (toEmail: string, fullName: string, verifyEmailURL: string) => {
  await emailClient.sendEmailWithTemplate({
    From: 'support@obsidiantracker.com',
    To: toEmail,
    MessageStream: Emails.welcomeVerify.messageStreamID,
    TemplateAlias: Emails.welcomeVerify.templateAlias,
    TemplateModel: {
      fullName,
      verifyEmailURL,
    },
  });
};

export const sendContactRequestEmail = async (body: string) => {
  await emailClient.sendEmailWithTemplate({
    From: 'support@obsidiantracker.com',
    To: 'zach@obsidiantracker.com',
    MessageStream: Emails.contactRequest.messageStreamID,
    TemplateAlias: Emails.contactRequest.templateAlias,
    TemplateModel: {
      body,
    },
  });
};
