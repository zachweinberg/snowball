import Head from 'next/head';
import React from 'react';
import Header from '~/components/Header';
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
      <div className="relative min-h-screen" id="root">
        <Header />
        <main>
          <div className="max-w-6xl px-4 pt-8 mx-auto">{children}</div>
        </main>
      </div>
    </>
  );
};

export default Layout;
