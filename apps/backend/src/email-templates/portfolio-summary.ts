import layout from './layout';

const html = layout(`
        <mj-text font-size="15px" line-height="1.4">
         Hey {{fullName}}, here is your {{period}} Portfolio Summary for your portfolio <a href="https://obsidiantracker.com/portfolios/{{portfolioID}}">{{portfolioName}}</a>:
        </mj-text>

        <mj-divider border-color="#ccc"></mj-divider>

        <mj-text font-weight="500" font-size="15px" align="center"> As of {{dateStr}}: </mj-text>

        <mj-text font-weight="500" font-size="15px" align="center"> Cash: {{cashValue}} </mj-text>

        <mj-text font-weight="500" font-size="15px" align="center"> Stocks: {{stocksValue}} </mj-text>

        <mj-text font-weight="500" font-size="15px" align="center"> Crypto: {{cryptoValue}} </mj-text>

        <mj-text font-weight="500" font-size="15px" align="center"> Real Estate: {{realEstateValue}} </mj-text>

        <mj-text font-weight="500" font-size="15px" align="center"> Custom Assets: {{customsValue}} </mj-text>

        <mj-text font-weight="600" font-size="15px" align="center"> Total: {{totalValue}} </mj-text>

        <mj-divider border-color="#ccc"></mj-divider>

        <mj-text align="center" font-size="13px">You can disable or edit these emails in your <a href="https://obsidiantracker.com/portfolios/{{portfolioID}}/settings">portfolio settings</a>.</mj-text>
     `);

const text = `Hi {{fullName}}, this is your {{period}} Portfolio Summary for your portfolio {{portfolioName}}.
    \n\n
    Cash: {{cashValue}}
    \n
    Stocks: {{stocksValue}}
    \n
    Crypto: {{cryptoValue}}
    \n
    Real Estate: {{realEstateValue}}
    \n
    Custom Assets: {{customsValue}}
    \n
    Total: {{totalValue}}
    \n\n
    You can disable or edit these emails in your portfolio settings at https://obsidiantracker.com/portfolios/{{portfolioID}}/settings.
    `;

export default {
  text,
  html,
};
