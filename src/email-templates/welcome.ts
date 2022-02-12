import layout from './layout';

const html = layout(`
        <mj-text line-height="1.4" font-weight="500" font-size="17px">Welcome, {{name}}!</mj-text>
        <mj-text line-height="1.4" font-size="15px">Thank you for signing up for Obsidian Tracker. If you are an investor of any kind, we hope you will find our asset tracker useful.</mj-text>
        <mj-text line-height="1.4" font-size="15px">We love feedback, so please feel free to let us know what you think via the <a href="https://obsidiantracker.com/contact">contact page</a>.</mj-text>
    `);

const text = `Welcome, {{name}}!
    \n\n
    Thank you for signing up for Obsidian Tracker. If you are an investor of any kind, we hope you will find our asset tracker useful.
    \n\n
    We love feedback, so please feel free to let us know what you think at https://obsidiantracker.com/contact.
    `;

export default {
  text,
  html,
};
