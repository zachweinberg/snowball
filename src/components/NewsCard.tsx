import { NewsItem } from '@zachweinberg/wealth-schema';
import Link from 'next/link';

interface Props {
  newsItem: NewsItem;
}

const NewsCard: React.FunctionComponent<Props> = ({ newsItem }: Props) => {
  return (
    <Link href={newsItem.newsURL}>
      <a>
        <div className="bg-white shadow rounded-sm p-5 mb-3 cursor-pointer hover:bg-blue0 transition-colors flex justify-between items-center">
          <div className="flex flex-col justify-between h-full">
            <h2 className="text-lg text-blue1 font-semibold">{newsItem.title}</h2>
            <p className="text-purple2 mb-3 text-md">{newsItem.text}</p>
            <div>
              <p className="text-sm text-purple1">- {newsItem.sourceName}</p>
            </div>
          </div>
          <div className="ml-4">
            <img src={newsItem.imageURL} className="max-w-xs w-40 h-40 object-cover" />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default NewsCard;
