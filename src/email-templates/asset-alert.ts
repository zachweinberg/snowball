import layout from './layout';

const html = layout(`
        <mj-text line-height="1.4" font-weight="500" font-size="17px">Your alert has triggered!</mj-text>
        <mj-text line-height="1.4" font-size="15px">Hi there, your alert for <strong>{{ symbol }}</strong> is {{ direction }} your price target of {{ priceStr }}.</mj-text>
        <mj-text line-height="1.4" font-size="15px">This alert has now been removed from your alert list.</mj-text>
        <mj-text line-height="1.4" font-size="15px">Click <a href="https://obsidiantracker.com/alerts">here</a> to view your existing asset alerts.</mj-text>
        <mj-divider border-color="#ccc"></mj-divider>
        <mj-text line-height="1.4" align="center">You are receiving this email because you set up an asset alert on <a href="https://obsidiantracker.com">Obsidian Tracker</a>.</mj-text>
      `);

const text = `
    Hi there, your alert for {{symbol}} is {{direction}} your price target of {{priceStr}}!
    \n\n
    This alert has now been removed from your alert list.
    \n\n
    Go to https://obsidiantracker.com/alerts to view your existing asset alerts.
    \n\n
    You are receiving this email because you set up an asset alert on Obsidian Tracker.
`;

export default {
  text,
  html,
};
