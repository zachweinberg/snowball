import classNames from 'classnames';
import debounce from 'lodash/debounce';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SearchPositionsResult } from '~/lib/algolia';

type Props = {
  label: string;
  name: string;
  placeholder: string;
  fetcher: (query: string) => Promise<any>;
  onSelect: (symbol: string, fullName: string) => void;
  className?: string;
};

const PositionSelector: React.FunctionComponent<Props> = ({
  label,
  placeholder,
  name,
  className,
  onSelect,
  fetcher,
}: Props) => {
  const [searchResults, setSearchResults] = useState<SearchPositionsResult[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  const search = async (query) => {
    const response = await fetcher(query);
    setSearchResults(response);
  };

  const debouncedSearch = useCallback(
    debounce((query) => search(query), 70),
    []
  );

  const detectClick = (e) => {
    if (!containerRef || containerRef.current === null) {
      return;
    }

    if (!containerRef.current.contains(e.target as Node)) {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener('click', detectClick);
    return () => document.removeEventListener('click', detectClick);
  }, []);

  const renderSearchResults = useMemo(() => {
    return searchResults.length === 0 ? null : (
      <div
        ref={containerRef}
        className="absolute z-40 w-full mt-1 overflow-y-auto border shadow-md rounded-md no-scrollbar bg-gray2 border-purple1"
      >
        {searchResults.map((result, i) => (
          <div
            onClick={() => {
              setSearchTerm(result.symbol);
              setSearchResults([]);
              onSelect(result.symbol, result.fullName);
            }}
            className={classNames(
              'flex items-center p-2 border-purple1 cursor-pointer hover:bg-gray4 text-purple2',
              { 'border-b': i !== searchResults.length - 1 }
            )}
            key={result.providerID}
          >
            {result.logoURL && <Image width={25} height={25} src={result.logoURL} />}
            <p className="p-1 text-sm rounded-md whitespace-nowrap">{result.symbol}</p>
            <p className="ml-2 text-sm font-semibold truncate">{result.fullName}</p>
          </div>
        ))}
      </div>
    );
  }, [searchResults]);

  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-bold tracking-widest uppercase text-purple1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={classNames(
            'px-3 py-2 rounded-lg border border-purple1 w-full bg-gray2 placeholder-purple1 text-gray10 focus:outline-none focus:ring-blue1 focus:border-blue1',
            className
          )}
          autoComplete="off"
          name={name}
          value={searchTerm}
          onChange={(e) => {
            const q = e.target.value;

            setSearchTerm(q);

            if (q === '') {
              setSearchResults([]);
            } else {
              debouncedSearch(q);
            }
          }}
          placeholder={placeholder}
        />
        {renderSearchResults}
      </div>
    </div>
  );
};

export default PositionSelector;
