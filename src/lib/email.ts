import * as postmark from 'postmark';

const emailClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY!);

const sendEmail = async (
  toEmail: string,
  subject: string,
  htmlBody: string,
  textBody: string,
  messageStreamID: string
): Promise<void> => {
  await emailClient.sendEmail({
    From: 'support@obsidiantracker.com',
    To: toEmail,
    Subject: subject,
    HtmlBody: htmlBody,
    TextBody: textBody,
    MessageStream: messageStreamID,
  });
};

export const sendVerifyEmailEmail = async (toEmail: string) => {
  const html = `
    <h1>Welcome to Obsidian Tracker.</h1>
    <p>We can't wait to help you track your net worth.</p>
    <p>Click here to verify your email address</p>
  `;

  const text = `
  Welcome to Obsidian Tracker.\n
  We can't wait to help you track your net worth.\n
  Click here to verify your email address.
`;

  await sendEmail(toEmail, 'Please verify your email address', html, text, 'verify-email');
};
