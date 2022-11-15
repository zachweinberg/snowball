import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { trackGoal } from 'fathom-client';
import { DateTime } from 'luxon';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { NewsItem } from 'schema';
import RequiredLoggedIn from '~/components/auth/RequireLoggedIn';
import Layout from '~/components/layout/Layout';
import Button from '~/components/ui/Button';
import Spinner from '~/components/ui/Spinner';
import TextInput from '~/components/ui/TextInput';
import { API } from '~/lib/api';

const getDateString = (newsItem: NewsItem) => {
  const newsDate = DateTime.fromISO(newsItem.date as any);
  const dayAgo = DateTime.local().minus({ days: 1 });

  if (newsDate < dayAgo) {
    return newsDate.toFormat('DD');
  } else {
    return formatDistanceToNow(new Date(newsItem.date), {
      addSuffix: true,
    });
  }
};

interface NewsCardProps {
  newsItem: NewsItem;
}

const NewsCard: React.FunctionComponent<NewsCardProps> = ({ newsItem }: NewsCardProps) => {
  return (
    <div className="flex p-6 transition-colors bg-white border rounded-md hover:bg-lightlime border-bordergray">
      <img className="object-cover mr-4 rounded-md w-28 h-28" src={newsItem.imageURL} />
      <div className="flex flex-col">
        <p className="mb-1 text-sm text-darkgray">{getDateString(newsItem)}</p>
        <p className="mb-1 font-semibold leading-tight truncate-news-card text-dark">
          {newsItem.title}
        </p>
        <div className="flex items-center mt-auto mb-1">
          <p className="mr-3 text-sm text-darkgray">{newsItem.sourceName}</p>
          <ArrowRightIcon className="w-4 h-4 text-darkgray" />
        </div>
      </div>
    </div>
  );
};

type NewsPage = { news: NewsItem[]; status: string };

const MAX_NUM_PAGES = 12;

const NewsPageContent: React.FunctionComponent = () => {
  const [query, setQuery] = useState<string>('');
  const [pageOfNews, setPageOfNews] = useState<NewsItem[]>([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [loadingNews, setLoadingNews] = useState<boolean>(true);
  const [hoveredNewsItem, setHoveredNewsItem] = useState<NewsItem | null>(null);
  const [page, setPage] = useState<number>(1);

  const loadNews = async (firstLoad: boolean = false) => {
    setLoadingNews(true);

    try {
      const response = await API.getNewsBypage(page, query ? query : undefined);

      if (response.news.length > 0) {
        setPageOfNews(response.news);
        setHoveredNewsItem(response.news[0]);
      }
    } catch (err) {
      toast(
        `Something went wrong while trying to load news. Please contact support if this persists.`
      );
    } finally {
      setLoadingNews(false);

      if (firstLoad) {
        setFirstLoad(false);
      }
    }
  };

  // initial fetch
  useEffect(() => {
    loadNews(true).then(() => setFirstLoad(false));
  }, []);

  // fetch again if page changes, but not on first load
  useEffect(() => {
    if (!firstLoad) {
      loadNews();
    }
  }, [page]);

  return (
    <Layout title="News | Snowball">
      <div className="flex items-center mb-7">
        <h1 className="font-bold text-[1.75rem]">News</h1>
      </div>

      {firstLoad ? (
        <div className="flex justify-center mt-20">
          <Spinner />
        </div>
      ) : pageOfNews.length === 0 ? null : (
        <div className={classNames({ 'opacity-60': loadingNews })}>
          {hoveredNewsItem && (
            <div className="grid grid-cols-1 gap-5 mb-5 lg:grid-cols-3">
              {/* Top row */}
              <a
                className="hidden col-span-2 p-6 transition-colors bg-white border rounded-md border-bordergray lg:flex hover:bg-lightlime"
                href={hoveredNewsItem.newsURL}
                target="__blank"
              >
                <img
                  className="object-cover mr-4 rounded-md w-52 h-52"
                  src={hoveredNewsItem.imageURL}
                />
                <div>
                  <div className="flex items-center mb-3">
                    <p className="mr-3 text-md text-darkgray">
                      {getDateString(hoveredNewsItem)} - {hoveredNewsItem.sourceName}
                    </p>
                    <ArrowRightIcon className="w-4 h-4 text-darkgray" />
                  </div>

                  <p className="mb-3 text-2xl font-semibold leading-tight text-dark truncate-news-card">
                    {hoveredNewsItem.title}
                  </p>
                  <p className="mb-3 leading-tight text-dark truncate-news-card">
                    {hoveredNewsItem.text}
                  </p>
                </div>
              </a>
              <div className="flex flex-col items-center justify-center col-span-1 p-6 text-center bg-white">
                <p className="mb-2 text-lg font-bold leading-tight text-dark">Filter news</p>
                <p className="mb-2 leading-snug">Search for stocks or crypto</p>
                <form
                  autoComplete="off"
                  className="flex items-center w-4/5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    trackGoal('58JLKQ2V', 0);
                    loadNews();
                  }}
                >
                  <TextInput
                    name="symbol"
                    placeholder="Filter..."
                    backgroundColor="#F9FAFF"
                    type="text"
                    className="w-2/3 mr-2"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                    }}
                  />
                  <Button className="w-1/3" type="submit">
                    Go
                  </Button>
                </form>
              </div>
            </div>
          )}
          {/* Main news grid */}
          <div className="grid grid-cols-1 gap-5 mb-7 lg:grid-cols-3">
            {pageOfNews.map((newsItem) => (
              <a
                onMouseEnter={() => setHoveredNewsItem(newsItem)}
                href={newsItem.newsURL}
                target="__blank"
                key={newsItem.title}
              >
                <NewsCard newsItem={newsItem} />
              </a>
            ))}
          </div>

          <div className="flex items-center justify-center mb-7">
            <button
              disabled={page <= 1}
              className="flex items-center p-3 mr-5 font-semibold bg-white border rounded-md cursor-pointer border-darkgray hover:bg-lightlime disabled:opacity-50"
              onClick={() => {
                if (page > 1 && !loadingNews) {
                  setPage(page - 1);
                }
              }}
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back
            </button>
            <button
              disabled={page >= MAX_NUM_PAGES}
              className="flex items-center p-3 font-semibold bg-white border rounded-md cursor-pointer mr-7 border-darkgray hover:bg-lightlime disabled:opacity-50"
              onClick={() => {
                if (page < MAX_NUM_PAGES && !loadingNews) {
                  setPage(page + 1);
                }
              }}
            >
              More
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

const NewsPage: NextPage = () => {
  return (
    <RequiredLoggedIn>
      <NewsPageContent />
    </RequiredLoggedIn>
  );
};

export default NewsPage;
