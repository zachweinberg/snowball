import { NextPage } from 'next';
import Features from '~/components/landing/Features';
import Hero from '~/components/landing/Hero';
import Header from '~/components/layout/Header';

const HomePage: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />
      <Hero />
      <Features />
    </div>
  );
};

export default HomePage;
