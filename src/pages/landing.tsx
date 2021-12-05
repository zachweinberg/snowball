import Header from '~/components/layout/Header';
import Button from '~/components/ui/Button';

const Landing: React.FunctionComponent = () => {
  return (
    <>
      <Header noBorder />
      <main className="bg-white">
        <div className="bg-dark px-6 py-10 pb-44 relative">
          <div className="text-center py-16 max-w-7xl mx-auto">
            <h1 className="text-white font-bold lg:text-5xl text-4xl mx-auto leading-tight lg:leading-tight">
              Track your financial assets and watch your portfolio grow
            </h1>
            <div className="w-64 mx-auto">
              <Button type="button" variant="secondary" className="mt-6">
                Get Started
              </Button>
            </div>
          </div>
          <img
            src="/img/landing/ui.png"
            className="absolute left-0 right-0 lg:max-w-4xl mx-auto shadow-2xl rounded-xl max-w-md"
          />
        </div>

        <div style={{ minHeight: '420px' }}></div>

        <div className="px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-2">
            <h2 className="font-bold text-2xl">Add stocks, crypto, real estate and cash</h2>
            <img src="/img/landing/news.png" className="shadow-2xl" />
          </div>
        </div>
      </main>
    </>
  );
};

export default Landing;
