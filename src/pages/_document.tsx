import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="theme-color" content="#000" />
          <meta name="description" content="Finance Hub"></meta>
        </Head>
        <body className="font-sans antialiased bg-background">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
