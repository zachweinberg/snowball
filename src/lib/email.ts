import { Alert, AlertDestination, Period } from '@zachweinberg/obsidian-schema';
import mjml from 'mjml';
import mustache from 'mustache';
import * as postmark from 'postmark';
import assetAlertTemplates from '~/email-templates/asset-alert';
import contactRequestTemplates from '~/email-templates/contact-request';
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
};

const fromEmail = (user: string) => `Obsidian Tracker <${user}@obsidiantracker.com>`;

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
    From: fromEmail('alerts'),
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
    From: fromEmail('support'),
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
    From: fromEmail('support'),
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
    From: fromEmail('alerts'),
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
