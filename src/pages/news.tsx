import { GetNewsResponse, NewsItem } from '@zachweinberg/wealth-schema';
import debounce from 'lodash/debounce';
import type { NextPage } from 'next';
import { useCallback, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import Button from '~/components/Button';
import Layout from '~/components/Layout';
import NewsCard from '~/components/NewsCard';
import Spinner from '~/components/Spinner';
import { request } from '~/lib/api';

type NewsPage = { news: NewsItem[]; status: string };

const NewsPage: NextPage = () => {
  const [textInput, setTextInput] = useState('');
  const [symbol, setSymbol] = useState('');

  const { data, error, size, setSize } = useSWRInfinite<NewsItem[]>(
    (index) => {
      if (symbol) {
        return `/api/news?page=${index + 1}&symbol=${symbol}`;
      } else {
        return `/api/news?page=${index + 1}`;
      }
    },
    async (url) => {
      const data = await request<undefined, GetNewsResponse>(url, 'get');
      return data.news;
    }
  );

  const debouncedSearch = useCallback(
    debounce((symbol) => setSymbol(symbol), 400),
    []
  );

  const newsItems = data ? [].concat(...(data as any[])) : [];

  const isLoadingInitialData = !data && !error;

  const isLoadingMore =
    isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');

  const isEmpty = data?.[0]?.length === 0;

  return (
    <Layout title="News">
      <h1 className="mb-3 text-xl font-bold leading-7 text-blue3 sm:text-2xl sm:truncate">
        News
      </h1>

      <div className="mb-3">
        <input
          value={textInput}
          onChange={(e) => {
            setTextInput(e.target.value.toUpperCase());
            debouncedSearch(e.target.value.toUpperCase());
          }}
          placeholder="Filter by symbol..."
          className="w-full px-3 py-2 border rounded-lg md:w-1/5 border-purple1 bg-gray2 placeholder-purple1 text-gray10 focus:outline-none focus:ring-blue1 focus:border-blue1"
        />
      </div>

      <div className="mb-5">
        {isEmpty ? <p>No news right now!</p> : null}
        {isLoadingInitialData ? (
          <div className="flex justify-center">
            <Spinner size={40} />
          </div>
        ) : (
          newsItems.map((newsItem, i) => <NewsCard key={i} newsItem={newsItem} />)
        )}
      </div>

      <div className="flex justify-center pb-20">
        {!isLoadingInitialData && size < 10 && (
          <Button
            type="button"
            onClick={() => setSize(size + 1)}
            className="w-1/4"
            disabled={isLoadingMore || isLoadingInitialData}
          >
            Load More
          </Button>
        )}
      </div>
    </Layout>
  );
};

export default NewsPage;
