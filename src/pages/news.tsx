import { NewsItem } from '@zachweinberg/wealth-schema';
import type { NextPage } from 'next';
import React, { useState } from 'react';
import useInfiniteSWR from 'swr/infinite';
import Button from '~/components/Button';
import Layout from '~/components/Layout';
import NewsCard from '~/components/NewsCard';
import Spinner from '~/components/Spinner';
import { request } from '~/lib/api';

type NewsPage = { news: NewsItem[]; status: string };

interface Props {
  pages?: NewsPage[];
  error?: any;
}

const InfiniteNews: React.FunctionComponent<Props> = ({ pages, error }: Props) => {
  if (error) {
    return <p>Could not load news.</p>;
  }

  if (!error && !pages) {
    return (
      <div className="w-full flex justify-center mt-8">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    pages &&
    pages.map((newsPage) => newsPage.news.map((newsItem) => <NewsCard newsItem={newsItem} />))
  );
};

const NewsPage: NextPage = () => {
  const [page, setPage] = useState(1);
  const {
    data: pages,
    error,
    size,
    setSize,
  } = useInfiniteSWR<NewsPage>(
    () => `news-${page}`,
    () => request(`/api/news?page=${page}`, 'get'),
    {
      revalidateOnFocus: false,
    }
  );

  return (
    <Layout title="News">
      <h1 className="text-xl font-bold leading-7 text-blue3 sm:text-2xl sm:truncate mb-5">
        News
      </h1>

      <InfiniteNews pages={pages} error={error} />

      <Button type="button" onClick={() => setSize(page + 1)}>
        Load More
      </Button>
    </Layout>
  );
};

export default NewsPage;
