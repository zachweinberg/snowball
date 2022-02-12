import layout from './layout';

const html = layout(`
      {{body}}
   `);

const text = `{{body}}`;

export default {
  text,
  html,
};
