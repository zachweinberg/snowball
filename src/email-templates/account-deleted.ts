import layout from './layout';

const html = layout(`
        <mj-text line-height="1.4" font-size="15px">This is a confirmation email that your account with Obsidian Tracker has been deleted.</mj-text>
        <mj-text line-height="1.4" font-size="15px">We are sorry to see you go. Please feel free to leave us some feedback <a href="https://obsidiantracker.com/contact">here</a>.</mj-text>
        <mj-text line-height="1.4" font-size="15px">- Obsidian Tracker Team</mj-text>
    `);

const text = `
This is a confirmation email that your account with Obsidian Tracker has been deleted.
    \n\n
    We are sorry to see you go!
    \n\n
    - Obsidian Tracker Team
    `;

export default {
  text,
  html,
};
