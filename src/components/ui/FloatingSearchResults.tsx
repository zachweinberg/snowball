import classNames from 'classnames';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { SearchPositionsResult } from '~/lib/algolia';

interface Props {
  onSelect: (symbol: string | null, fullName?: string, logoURL?: string) => void;
  searchResults: SearchPositionsResult[];
}

const FloatingSearchResults: React.FunctionComponent<Props> = ({
  onSelect,
  searchResults,
}: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = (e) => {
    if (searchResults.length === 0) {
      return;
    }

    if (e.keyCode === 40) {
      // Down arrow
      if (selectedIndex <= length) {
        setSelectedIndex((currIndex) => currIndex + 1);
      }
    } else if (e.keyCode === 38) {
      // Up arrow
      setSelectedIndex((currIndex) => currIndex - 1);
    }
  };

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

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return searchResults.length === 0 ? null : (
    <div
      ref={containerRef}
      className="absolute z-50 w-full mt-4 overflow-y-auto bg-white shadow-2xl rounded-xl no-scrollbar"
    >
      {searchResults.map((result, i) => (
        <div
          onClick={() => {
            onSelect(result.symbol, result.fullName, result.logoURL);
          }}
          className={classNames('flex items-center py-4 cursor-pointer hover:bg-lightlime', {
            'pl-4': result.logoURL,
            'bg-lightlime': selectedIndex === i,
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
          <div className="w-full px-4 leading-tight">
            <p className="truncate text-evergreen font-semibold text-[1.2rem] mb-1">
              {result.symbol}
            </p>
            <p className=" text-darkgray text-[0.95rem] font-medium truncate">
              {result.fullName}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloatingSearchResults;
