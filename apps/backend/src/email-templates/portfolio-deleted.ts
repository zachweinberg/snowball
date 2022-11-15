import layout from './layout';

const html = layout(`
        <mj-text line-height="1.4" font-size="15px">This is a confirmation email that your portfolio named '{{portfolioName}}' has been deleted on Snowball.</mj-text>
    `);

const text = `
This is a confirmation email that your portfolio named '{{portfolioName}}' has been deleted on Snowball.`;

export default {
  text,
  html,
};
