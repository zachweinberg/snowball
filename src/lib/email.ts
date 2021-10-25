import mjml from 'mjml';
import mustache from 'mustache';
import * as postmark from 'postmark';

const emailClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY!);

export const sendEmail = async (
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

export const sendVerifyEmailEmail = async (toEmail: string, token: string, userID: string) => {
  const renderedMJML = mustache.render(mjmlTemplate, { user: 'Zach' });
  const html = mjml(renderedMJML).html;

  // const html = `
  //   <h1>Welcome to Obsidian Tracker.</h1>
  //   <p>We can't wait to help you track your net worth.</p>
  //   <a href="https://obsidiantracker.com/verify?t=${token}&u=${userID}">Click here to verify your email address</a>
  // `;

  const text = `
  Welcome to Obsidian Tracker.\n
  We can't wait to help you track your net worth.\n
  Click here to verify your email address:
  https://obsidiantracker.com/verify?t=${token}&u=${userID}
`;

  await sendEmail(toEmail, 'Please verify your email address', html, text, 'verify-email');
};

const mjmlTemplate = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image width="100px" src="https://mjml.io/assets/img/logo-small.png"></mj-image>
        <mj-divider border-color="#F45E43"></mj-divider>
        <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello {{user}}</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;
