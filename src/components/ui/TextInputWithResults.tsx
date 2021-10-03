import { AssetType } from '@zachweinberg/wealth-schema';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { searchCrypto, SearchPositionsResult, searchStocks } from '~/lib/algolia';
import InputResults from './InputResults';
import TextInput from './TextInput';

interface Props {
  placeholder: string;
  type: AssetType.Stock | AssetType.Crypto | 'Both';
  onError: (string) => void;
  onResult: (symbol: string, fullName: string) => void;
}

const TextInputWithResults: React.FunctionComponent<Props> = ({
  placeholder,
  type,
  onError,
  onResult,
}: Props) => {
  const [searchResults, setSearchResults] = useState<SearchPositionsResult[]>([]);
  const [symbol, setSymbol] = useState('');

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (type === 'Both') {
        const promises = await Promise.all([searchStocks(query), searchCrypto(query)]);
        setSearchResults([...promises[0], ...promises[1]]);
      } else {
        const response =
          type === AssetType.Stock ? await searchStocks(query) : await searchCrypto(query);
        setSearchResults(response);
      }
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

      <InputResults
        onSelect={(symbol, fullName) => {
          if (symbol) {
            if (!fullName) {
              onError("We can't find that company. Please contact support.");
              return;
            }

            onResult(symbol, fullName);
          }

          setSearchResults([]);
        }}
        searchResults={searchResults}
      />
    </div>
  );
};

export default TextInputWithResults;
