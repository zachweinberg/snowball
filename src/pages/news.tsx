import { GetNewsResponse, NewsItem } from '@zachweinberg/obsidian-schema';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import debounce from 'lodash/debounce';
import { DateTime } from 'luxon';
import type { NextPage } from 'next';
import { useCallback, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import Layout from '~/components/layout/Layout';
import Button from '~/components/ui/Button';
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
    <Layout title="News - Obsidian Tracker">
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
      <div className="grid grid-cols-3 gap-5 mb-10">
        {newsItems.map((item: NewsItem) => (
          <a href={item.newsURL} target="__blank">
            <NewsCard newsItem={item} />
          </a>
        ))}
      </div>
      <div className="flex justify-center">
        {!isLoadingInitialData && size < 10 && (
          <Button
            type="button"
            variant="secondary"
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
  const getDateString = () => {
    const newsDate = DateTime.fromISO(newsItem.date);
    const dayAgo = DateTime.local().minus({ days: 1 });

    if (newsDate < dayAgo) {
      return newsDate.toFormat('DD');
    } else {
      return formatDistanceToNow(new Date(newsItem.date), {
        addSuffix: true,
      });
    }
  };

  return (
    <div className="flex p-6 bg-white border rounded-md border-bordergray">
      <img
        src={newsItem.imageURL}
        className="object-cover rounded-md w-28 h-28 max-h-28 max-w-28 mr-2"
      />
      <div className="text-sm text-darkgray">
        <p>
          {getDateString()} | {newsItem.sourceName}
        </p>
      </div>
    </div>
  );
};
