import layout from './layout';

const html = layout(`
        <mj-text line-height="1.4" font-size="15px">This is a confirmation email that your portfolio named '{{portfolioName}}' has been deleted.</mj-text>
        <mj-text line-height="1.4" font-size="15px">- Obsidian Tracker Team</mj-text>
    `);

const text = `
This is a confirmation email that your portfolio named '{{portfolioName}}' has been deleted.
\n\n
    - Obsidian Tracker Team
    `;

export default {
  text,
  html,
};
