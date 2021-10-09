import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="theme-color" content="#000" />
          <meta
            name="description"
            content="Obsidian Tracker - track your net worth. Assets include stocks, crypto, real estate, options, cash and more."
          ></meta>
        </Head>
        <body className="antialiased font-poppins bg-background">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
