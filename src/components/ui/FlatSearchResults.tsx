import Image from 'next/image';
import { SearchPositionsResult } from '~/lib/algolia';

interface Props {
  onSelect: (symbol: string | null, fullName?: string, logoURL?: string) => void;
  searchResults: SearchPositionsResult[];
}

const FlatSearchResults: React.FunctionComponent<Props> = ({
  searchResults,
  onSelect,
}: Props) => {
  return searchResults.length === 0
    ? null
    : searchResults.map((result) => (
        <div
          onClick={() => {
            onSelect(result.symbol, result.fullName, result.logoURL);
          }}
          className="py-3 px-6 text-left cursor-pointer flex items-center hover:bg-lightlime"
          key={result.providerID}
        >
          {result.logoURL && (
            <div className="mr-4">
              <Image
                width={25}
                height={25}
                src={result.logoURL}
                alt={result.fullName}
                className="rounded-lg"
              />
            </div>
          )}
          <div>
            <p className="whitespace-nowrap text-evergreen font-semibold text-[1.2rem] mb-1">
              {result.symbol}
            </p>
            <p className="whitespace-nowrap text-darkgray text-[0.95rem] font-medium truncate leading-tight">
              {result.fullName}
            </p>
          </div>
        </div>
      ));
};

export default FlatSearchResults;
