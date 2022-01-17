import { Alert, AlertDestination, Period } from '@zachweinberg/obsidian-schema';
import * as postmark from 'postmark';
import { formatMoneyFromNumber } from '~/utils/money';

const emailClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY!);

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
  portfolioReminder: {
    templateAlias: '',
    messageStreamID: '',
  },
};

export const sendWelcomeEmail = async (toEmail: string, name) => {
  await emailClient.sendEmailWithTemplate({
    From: 'Obsidian Tracker <support@obsidiantracker.com>',
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
    From: 'Obsidian Tracker <support@obsidiantracker.com>',
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

  try {
    await emailClient.sendEmailWithTemplate({
      From: 'Obsidian Tracker <alerts@obsidiantracker.com>',
      To: alert.destinationValue,
      MessageStream: Emails.assetAlert.messageStreamID,
      TemplateAlias: Emails.assetAlert.templateAlias,
      TemplateModel: {
        symbol: alert.symbol,
        direction: alert.condition.toLowerCase(),
        priceStr: formatMoneyFromNumber(alert.price),
      },
    });
  } catch (err) {
    console.error('Could not send email to', alert.destinationValue, err);
  }
};

export const sendPortfolioReminderEmail = async (toEmail: string, period: Period, portfolioID: string) => {
  await emailClient.sendEmailWithTemplate({
    From: 'Obsidian Tracker <alerts@obsidiantracker.com>',
    To: toEmail,
    MessageStream: Emails.portfolioReminder.messageStreamID,
    TemplateAlias: Emails.portfolioReminder.templateAlias,
    TemplateModel: {
      period,
      portfolioID,
    },
  });
};
