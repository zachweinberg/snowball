import { NextPage } from 'next';
import Script from 'next/script';
import Layout from '~/components/layout/Layout';

const PrivacyPolicy: NextPage = () => {
  return (
    <>
      <Script src="/js/termly.js" />
      <Layout title="Privacy Policy | Obsidian Tracker">
        <div
          // @ts-ignore
          name="termly-embed"
          data-id="19f32aaf-07d1-41d3-81e6-43c053321e90"
          data-type="iframe"
        ></div>
      </Layout>
    </>
  );
};

export default PrivacyPolicy;
