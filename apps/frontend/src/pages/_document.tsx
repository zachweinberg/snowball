import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://cdn.usefathom.com" crossOrigin="" />

          <script
            async
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry&language=en`}
          ></script>

          <meta charSet="utf-8" />

          <meta name="title" content="Snowball - Track all of your assets in one place." />

          <meta
            name="description"
            content="Track your stocks, crypto, real estate, cash and more in one place."
          />

          <meta name="robots" content="index, follow" />

          <meta
            property="og:title"
            content="Snowball - Track all of your assets in one place."
          />

          <meta property="og:type" content="website" />

          <meta
            property="og:image"
            content="https://firebasestorage.googleapis.com/v0/b/lyra-ae77c.appspot.com/o/img%2Fobsidian.jpeg?alt=media"
          />

          <meta property="og:url" content="https://snowballtracker.io" />

          <meta
            property="og:description"
            content="Track stocks, crypto, real estate, cash and more in one place. Watch your entire net worth grow."
          />

          <meta
            name="twitter:title"
            content="Snowball - Track all of your assets in one place."
          />

          <meta
            name="twitter:description"
            content="Track stocks, crypto, real estate, cash and more in one place. Watch your entire net worth grow."
          />

          <meta name="twitter:card" content="summary_large_image" />

          <meta property="twitter:url" content="https://snowballtracker.io" />

          <meta
            property="twitter:image"
            content="https://firebasestorage.googleapis.com/v0/b/lyra-ae77c.appspot.com/o/img%2Fobsidian.jpeg?alt=media"
          />

          <meta name="theme-color" content="#000" />

          <script async src={`https://www.googletagmanager.com/gtag/js?id=AW-10853293292`} />

          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-10853293292');
          `,
            }}
          />
        </Head>
        <body className="antialiased font-poppins bg-background">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
