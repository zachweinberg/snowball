import classNames from 'classnames';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { SearchPositionsResult } from '~/lib/algolia';

interface Props {
  onSelect: (
    symbol: string | null,
    objectID: string | null,
    fullName?: string,
    logoURL?: string
  ) => void;
  searchResults: SearchPositionsResult[];
}

const FlatSearchResults: React.FunctionComponent<Props> = ({
  searchResults,
  onSelect,
}: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = (e) => {
    if (e.keyCode === 40) {
      // Down arrow
      console.log(selectedIndex, length);
      if (selectedIndex <= length) {
        setSelectedIndex((currIndex) => currIndex + 1);
      }
    } else if (e.keyCode === 38) {
      // Up arrow
      setSelectedIndex((currIndex) => currIndex - 1);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return searchResults.length === 0 ? null : (
    <>
      {searchResults.map((result, i) => (
        <div
          onClick={() => {
            onSelect(result.symbol, result.objectID, result.fullName, result.logoURL);
          }}
          className={classNames(
            'flex items-center px-6 py-3 text-left cursor-pointer hover:bg-lightlime',
            { 'bg-lightlime': selectedIndex === i }
          )}
          key={i}
        >
          {result.logoURL && (
            <div className="mr-4">
              <Image
                width={25}
                height={25}
                src={result.logoURL}
                alt={result.fullName}
                className="rounded-md"
              />
            </div>
          )}
          <div className="w-full">
            <p className="text-evergreen font-semibold text-[1.2rem] mb-1">{result.symbol}</p>
            <p className="text-darkgray text-[0.95rem] font-medium truncate leading-tight">
              {result.fullName}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default FlatSearchResults;
