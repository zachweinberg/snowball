import { NextPage } from 'next';
import Layout from '~/components/layout/Layout';

const Contact: NextPage = () => {
  return (
    <Layout title="Contact Us">
      <div className="max-w-xl p-6 mx-auto bg-white border rounded-lg border-gray">
        <h1 className="mb-6 text-4xl font-bold text-center">Contact Us</h1>

        <p className="text-lg text-left text-darkgray">
          Obsidian Tracker is built by a small team and we're always looking for feedback or
          suggestions! Feel free to contact us and we'll get back to you as soon as we can.
        </p>

        <p>Our email: support@obsidiantracker.com</p>
      </div>
    </Layout>
  );
};

export default Contact;
