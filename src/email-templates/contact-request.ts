import layout from './layout';

const html = layout(`
      <mj-text>
        Message: {{message}}<br/>
        Name: {{name}}<br/>
        Email: {{email}}
      </mj-text>
   `);

const text = `{{message}}\n\n{{name}}\n\n{{email}}`;

export default {
  text,
  html,
};
