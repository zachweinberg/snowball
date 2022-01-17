import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '~/components/layout/Layout';

const TermsOfUse: NextPage = () => {
  return (
    <>
      <Head>
        <script src="/js/termly.js" />
      </Head>
      <Layout title="Terms of Use | Obsidian Tracker">
        <div
          // @ts-ignore
          name="termly-embed"
          data-id="764fd38d-83d1-4ebd-95b9-7502f5504720"
          data-type="iframe"
        ></div>
      </Layout>
    </>
  );
};

export default TermsOfUse;
