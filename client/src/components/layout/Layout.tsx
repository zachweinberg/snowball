import Head from 'next/head';
import React from 'react';
import Header from '~/components/layout/Header';
import Footer from './Footer';
interface Props {
  title: string;
  children: React.ReactNode;
}

const Layout: React.FunctionComponent<Props> = ({ children, title }: Props) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="relative flex flex-col min-h-screen" id="root">
        <Header />
        <main className="flex-1">
          <div className="px-4 pt-8 mx-auto max-w-7xl">{children}</div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
