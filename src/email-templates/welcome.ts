import layout from './layout';

const html = layout(`
      <mj-column>
        <mj-text font-weight="500" font-size="18px">Welcome, {{name}}!</mj-text>
        <mj-text font-size="16px">Thank you for signing up for Obsidian Tracker. If you are an investor of any kind, we hope you will find our asset tracker useful.</mj-text>
        <mj-text font-size="16px">We love feedback, so please feel free to let us know what you think via the <a href="https://obsidiantracker.com/contact">contact page</a>.</mj-text>
      </mj-column>`);

const text = `Welcome, {{name}}!
    \n\n
    Thank you for signing up for Obsidian Tracker. If you are an investor of any kind, we hope you will find our asset tracker useful.
    \n\n
    We love feedback, so please feel free to let us know what you think via the <a href="https://obsidiantracker.com/contact">contact page</a>.
    `;

export default {
  text,
  html,
};
