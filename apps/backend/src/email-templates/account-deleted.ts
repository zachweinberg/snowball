import layout from './layout';

const html = layout(`
        <mj-text line-height="1.4" font-size="15px">This is a confirmation email that your account with Snowball has been deleted.</mj-text>
    `);

const text = `
This is a confirmation email that your account with Snowball has been deleted.`;

export default {
  text,
  html,
};
