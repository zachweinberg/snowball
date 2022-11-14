import { Alert, AlertDestination, Period } from '@zachweinberg/obsidian-schema';
import mjml from 'mjml';
import mustache from 'mustache';
import * as postmark from 'postmark';
import accountDeletedTemplates from '~/email-templates/account-deleted';
import assetAlertTemplates from '~/email-templates/asset-alert';
import contactRequestTemplates from '~/email-templates/contact-request';
import portfolioDeletedTemplates from '~/email-templates/portfolio-deleted';
import portfolioSummaryEmailTemplates from '~/email-templates/portfolio-summary';
import welcomeEmailTemplates from '~/email-templates/welcome';
import { formatMoneyFromNumber } from '~/utils/money';

const emailClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY!);

const Emails = {
  portfolioSummary: {
    templates: portfolioSummaryEmailTemplates,
    messageStreamID: 'portfolio-summary',
  },
  welcome: {
    templates: welcomeEmailTemplates,
    messageStreamID: 'welcome-email',
  },
  contactRequest: {
    templates: contactRequestTemplates,
    messageStreamID: 'contact-submissions',
  },
  assetAlert: {
    templates: assetAlertTemplates,
    messageStreamID: 'asset-alerts',
  },
  accountDeleted: {
    templates: accountDeletedTemplates,
    messageStreamID: 'account-deleted',
  },
  portfolioDeleted: {
    templates: portfolioDeletedTemplates,
    messageStreamID: 'portfolio-deleted',
  },
};

const FROM_EMAIL = 'support@obsidiantracker.com';

const renderEmailHtmlAndText = (templateFile: { html: string; text: string }, templateVars: object) => {
  const renderedMJML = mustache.render(templateFile.html, templateVars);
  const TextBody = mustache.render(templateFile.text, templateVars);
  const HtmlBody = mjml(renderedMJML).html;
  return {
    HtmlBody,
    TextBody,
  };
};

export const sendPortfolioSummaryEmail = async (
  toEmail: string,
  period: Period,
  portfolioName: string,
  portfolioID: string,
  stocksValue: number,
  cryptoValue: number,
  cashValue: number,
  realEstateValue: number,
  customsValue: number,
  totalValue: number,
  dateStr: string,
  fullName
) => {
  await emailClient.sendEmail({
    From: FROM_EMAIL,
    To: toEmail,
    MessageStream: Emails.portfolioSummary.messageStreamID,
    Subject: `${portfolioName} Portfolio Summary`,
    ...renderEmailHtmlAndText(Emails.portfolioSummary.templates, {
      dateStr,
      period,
      fullName,
      portfolioName,
      portfolioID,
      stocksValue: formatMoneyFromNumber(stocksValue),
      cryptoValue: formatMoneyFromNumber(cryptoValue),
      cashValue: formatMoneyFromNumber(cashValue),
      realEstateValue: formatMoneyFromNumber(realEstateValue),
      customsValue: formatMoneyFromNumber(customsValue),
      totalValue: formatMoneyFromNumber(totalValue),
    }),
  });
};

export const sendWelcomeEmail = async (toEmail: string, name) => {
  await emailClient.sendEmail({
    From: FROM_EMAIL,
    To: toEmail,
    MessageStream: Emails.welcome.messageStreamID,
    Subject: `Welcome to Obsidian Tracker!`,
    ...renderEmailHtmlAndText(Emails.welcome.templates, {
      name,
    }),
  });
};

export const sendContactRequestEmail = async (name: string, message: string, email?: string) => {
  await emailClient.sendEmail({
    From: FROM_EMAIL,
    To: 'zach@obsidiantracker.com',
    Subject: 'New Contact Request',
    MessageStream: Emails.contactRequest.messageStreamID,
    ...renderEmailHtmlAndText(Emails.contactRequest.templates, {
      message,
      name,
      email,
    }),
  });
};

export const sendAssetAlertEmail = async (alert: Alert) => {
  if (alert.destination !== AlertDestination.Email) {
    return;
  }

  const { condition, symbol } = alert;
  const direction = condition.toLowerCase();
  const priceStr = formatMoneyFromNumber(alert.price);

  await emailClient.sendEmail({
    From: FROM_EMAIL,
    To: alert.destinationValue,
    MessageStream: Emails.assetAlert.messageStreamID,
    Subject: `${symbol} is ${direction} your price target of ${priceStr}`,
    ...renderEmailHtmlAndText(Emails.assetAlert.templates, {
      symbol,
      direction,
      priceStr,
    }),
  });
};

export const sendAccountDeletedEmail = async (toEmail: string) => {
  await emailClient.sendEmail({
    From: FROM_EMAIL,
    To: toEmail,
    MessageStream: Emails.accountDeleted.messageStreamID,
    Subject: `Your account has been deleted`,
    ...renderEmailHtmlAndText(Emails.accountDeleted.templates, {}),
  });
};

export const sendPortfolioDeletedEmail = async (toEmail: string, portfolioName: string) => {
  await emailClient.sendEmail({
    From: FROM_EMAIL,
    To: toEmail,
    MessageStream: Emails.portfolioDeleted.messageStreamID,
    Subject: `Your portfolio has been deleted`,
    ...renderEmailHtmlAndText(Emails.portfolioDeleted.templates, {
      portfolioName,
    }),
  });
};

export const newUserEmail = async (email: string, name: string) => {
  await emailClient.sendEmail({
    From: FROM_EMAIL,
    To: 'zach@obsidiantracker.com',
    Subject: `new user`,
    HtmlBody: `<h1>new user</h1><p>${email} - ${name}</p>`,
    TextBody: `New user - ${email} - ${name}`,
  });
};
