import layout from './layout';

const html = layout(`
        <mj-text line-height="1.4" font-weight="500" font-size="15px">Welcome, {{name}}!</mj-text>
        <mj-text line-height="1.4" font-size="15px">Thank you for signing up for Snowball. If you are an investor of any kind, we hope you will find this asset tracker useful.</mj-text>
    `);

const text = `Welcome, {{name}}!
    \n\n
    Thank you for signing up for Snowball. If you are an investor of any kind, we hope you will find our asset tracker useful.`;

export default {
  text,
  html,
};
