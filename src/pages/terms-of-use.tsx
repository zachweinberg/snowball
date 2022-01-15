import { NextPage } from 'next';
import Script from 'next/script';
import Layout from '~/components/layout/Layout';

const PrivacyPolicy: NextPage = () => {
  return (
    <>
      <Script src="/js/terms-of-use.js" />
      <Layout title="Terms | Obsidian Tracker">
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

export default PrivacyPolicy;
