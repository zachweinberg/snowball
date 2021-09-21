import { GetNewsResponse, NewsItem } from '@zachweinberg/wealth-schema';
import debounce from 'lodash/debounce';
import type { NextPage } from 'next';
import { useCallback, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import Layout from '~/components/layout/Layout';
import Button from '~/components/ui/Button';
import Link from '~/components/ui/Link';
import TextInput from '~/components/ui/TextInput';
import { request } from '~/lib/api';

type NewsPage = { news: NewsItem[]; status: string };

const NewsPage: NextPage = () => {
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
      <div className="flex items-center justify-between mb-7">
        <h1 className="font-bold text-[1.75rem]">News</h1>
        <div className="w-80">
          <TextInput
            type="text"
            value={symbol}
            name="symbol"
            placeholder="Filter news by symbol..."
            onChange={(e) => {
              debouncedSearch(e.target.value.toUpperCase());
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5 mb-10">
        {newsItems.map((item) => (
          <NewsCard newsItem={item} />
        ))}
      </div>
      <div className="flex justify-center">
        {!isLoadingInitialData && size < 10 && (
          <Button
            type="button"
            secondary
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

interface Props {
  newsItem: NewsItem;
}

const NewsCard: React.FunctionComponent<Props> = ({ newsItem }: Props) => {
  return (
    <Link href={newsItem.newsURL}>
      <div className="flex items-center h-56 bg-white p-7 rounded-2xl hover:bg-gray">
        <img
          src={newsItem.imageURL}
          className="object-cover max-w-xs w-36 h-36 mr-7 rounded-xl"
        />
        <div className="flex flex-col">
          <div className="mb-2">
            <p className="font-normal text-[1.05rem]">{newsItem.sourceName}</p>
          </div>
          <div>
            <h2 className="mb-5 font-semibold text-[.9rem]">{newsItem.title}</h2>
            <p className="font-normal truncate-paragraph">{newsItem.text}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
