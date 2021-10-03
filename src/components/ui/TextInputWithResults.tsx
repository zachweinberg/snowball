import { AssetType } from '@zachweinberg/wealth-schema';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { searchCrypto, SearchPositionsResult, searchStocks } from '~/lib/algolia';
import FloatingSearchResults from './FloatingSearchResults';
import TextInput from './TextInput';

interface Props {
  placeholder: string;
  type: AssetType.Stock | AssetType.Crypto;
  onError: (string) => void;
  onResult: (symbol: string, fullName: string) => void;
  backgroundColor?: string;
  clearOnSelection?: boolean;
  floatingResults?: boolean;
}

const TextInputWithResults: React.FunctionComponent<Props> = ({
  placeholder,
  type,
  clearOnSelection,
  backgroundColor,
  floatingResults,
  onResult,
  onError,
}: Props) => {
  const [searchResults, setSearchResults] = useState<SearchPositionsResult[]>([]);
  const [symbol, setSymbol] = useState('');

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      const response =
        type === AssetType.Stock ? await searchStocks(query) : await searchCrypto(query);
      setSearchResults(response);
    }, 75),
    []
  );

  return (
    <div className="relative mb-4">
      <TextInput
        placeholder={placeholder}
        type="text"
        name="symbol"
        required
        value={symbol}
        backgroundColor={backgroundColor}
        onChange={(e) => {
          const query = e.target.value.toUpperCase();
          setSymbol(query);
          if (query === '') {
            setSearchResults([]);
          } else {
            debouncedSearch(query);
          }
        }}
      />

      {floatingResults ? (
        <FloatingSearchResults
          onSelect={(symbol, fullName) => {
            if (symbol) {
              if (!fullName) {
                onError("We can't find that company. Please contact support.");
                return;
              }

              onResult(symbol, fullName);

              if (clearOnSelection) {
                setSymbol('');
              }
            }

            setSearchResults([]);
          }}
          searchResults={searchResults}
        />
      ) : (
        searchResults.map((result) => (
          <div
            onClick={() => {
              // onSelect(result.symbol, result.fullName);
            }}
            className="p-3 overflow-auto text-left cursor-pointer hover:bg-lightlime"
            key={result.providerID}
          >
            {result.logoURL && (
              <Image width={25} height={25} src={result.logoURL} alt={result.fullName} />
            )}
            <div>
              <p className="whitespace-nowrap text-evergreen font-semibold text-[1.2rem] mb-1">
                {result.symbol}
              </p>
              <p className="whitespace-nowrap text-darkgray text-[0.95rem] font-medium">
                {result.fullName}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TextInputWithResults;
