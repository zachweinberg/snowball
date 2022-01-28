import { Alert, AlertDestination, Period } from '@zachweinberg/obsidian-schema';
import * as postmark from 'postmark';
import { formatMoneyFromNumber } from '~/utils/money';

const emailClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY!);

const fromEmail = (user: string) => `Obsidian Tracker <${user}@obsidiantracker.com>`;

const Emails = {
  welcome: {
    templateAlias: 'welcome-email',
    messageStreamID: 'welcome-email',
  },
  contactRequest: {
    templateAlias: 'contact-request-email',
    messageStreamID: 'contact-submissions',
  },
  assetAlert: {
    templateAlias: 'asset-alert',
    messageStreamID: 'asset-alerts',
  },
  portfolioSummary: {
    templateAlias: '',
    messageStreamID: 'portfolio-summary',
  },
  portfolioReminder: {
    templateAlias: '',
    messageStreamID: 'portfolio-reminder',
  },
};

export const sendWelcomeEmail = async (toEmail: string, name) => {
  await emailClient.sendEmailWithTemplate({
    From: fromEmail('support'),
    To: toEmail,
    MessageStream: Emails.welcome.messageStreamID,
    TemplateAlias: Emails.welcome.templateAlias,
    TemplateModel: {
      name,
    },
  });
};

export const sendContactRequestEmail = async (body: string) => {
  await emailClient.sendEmailWithTemplate({
    From: fromEmail('support'),
    To: 'zach@obsidiantracker.com',
    MessageStream: Emails.contactRequest.messageStreamID,
    TemplateAlias: Emails.contactRequest.templateAlias,
    TemplateModel: {
      body,
    },
  });
};

export const sendAssetAlertEmail = async (alert: Alert) => {
  if (alert.destination !== AlertDestination.Email) {
    return;
  }

  await emailClient.sendEmailWithTemplate({
    From: fromEmail('alerts'),
    To: alert.destinationValue,
    MessageStream: Emails.assetAlert.messageStreamID,
    TemplateAlias: Emails.assetAlert.templateAlias,
    TemplateModel: {
      symbol: alert.symbol,
      direction: alert.condition.toLowerCase(),
      priceStr: formatMoneyFromNumber(alert.price),
    },
  });
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
  totalValue: number
) => {
  await emailClient.sendEmailWithTemplate({
    From: fromEmail('alerts'),
    To: toEmail,
    MessageStream: Emails.portfolioSummary.messageStreamID,
    TemplateAlias: Emails.portfolioSummary.templateAlias,
    TemplateModel: {
      period,
      portfolioName,
      portfolioID,
      stocksValue,
      cryptoValue,
      cashValue,
      realEstateValue,
      customsValue,
      totalValue,
    },
  });
};

export const sendPortfolioReminderEmail = async (
  toEmail: string,
  period: Period,
  portfolioName: string,
  portfolioID: string,
  fullName: string
) => {
  await emailClient.sendEmailWithTemplate({
    From: fromEmail('alerts'),
    To: toEmail,
    MessageStream: Emails.portfolioReminder.messageStreamID,
    TemplateAlias: Emails.portfolioReminder.templateAlias,
    TemplateModel: {
      period: period.toLowerCase(),
      fullName,
      portfolioName,
      portfolioID,
    },
  });
};
