import { NewsItem } from '@zachweinberg/wealth-schema';
import Link from 'next/link';

interface Props {
  newsItem: NewsItem;
}

const NewsCard: React.FunctionComponent<Props> = ({ newsItem }: Props) => {
  return (
    <Link href={newsItem.newsURL}>
      <a target="_blank">
        <div className="flex items-center justify-between p-4 mb-2 transition-colors bg-white rounded-md shadow cursor-pointer hover:bg-blue0">
          <div className="h-full">
            <h2 className="text-lg font-semibold text-blue1">{newsItem.title}</h2>
            <p className="mb-3 text-purple2 text-md">{newsItem.text}</p>
            <div>
              <p className="text-sm text-purple1">- {newsItem.sourceName}</p>
            </div>
          </div>
          <div className="ml-4">
            <img
              src={newsItem.imageURL}
              className="object-cover w-40 h-40 max-w-xs rounded-md"
            />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default NewsCard;
