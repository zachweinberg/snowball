import classNames from 'classnames';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { SearchPositionsResult } from '~/lib/algolia';

interface Props {
  onSelect: (symbol: string | null, fullName?: string, logoURL?: string) => void;
  searchResults: SearchPositionsResult[];
}

const FloatingSearchResults: React.FunctionComponent<Props> = ({
  onSelect,
  searchResults,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const detectClick = (e) => {
    if (!containerRef || containerRef.current === null) {
      return;
    }

    if (!containerRef.current.contains(e.target as Node)) {
      onSelect(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', detectClick);
    return () => document.removeEventListener('click', detectClick);
  }, []);

  return searchResults.length === 0 ? null : (
    <div
      ref={containerRef}
      className="absolute z-50 w-full mt-4 overflow-y-auto bg-white shadow-2xl rounded-xl no-scrollbar"
    >
      {searchResults.map((result) => (
        <div
          onClick={() => {
            onSelect(result.symbol, result.fullName, result.logoURL);
          }}
          className={classNames('flex items-center py-4 cursor-pointer hover:bg-lightlime', {
            'pl-4': result.logoURL,
          })}
          key={result.providerID}
        >
          {result.logoURL && (
            <Image
              width={25}
              height={25}
              src={result.logoURL}
              alt={result.fullName}
              className="rounded-lg"
            />
          )}
          <div className="ml-4">
            <p className="whitespace-nowrap text-evergreen font-semibold text-[1.2rem] mb-1">
              {result.symbol}
            </p>
            <p className="whitespace-nowrap text-darkgray text-[0.95rem] font-medium">
              {result.fullName}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloatingSearchResults;
