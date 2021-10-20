import { AssetType } from '@zachweinberg/obsidian-schema';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { searchCrypto, SearchPositionsResult, searchStocks } from '~/lib/algolia';
import FlatSearchResults from './FlatSearchResults';
import FloatingSearchResults from './FloatingSearchResults';
import TextInput from './TextInput';
interface Props {
  placeholder: string;
  type: AssetType;
  onError: (string) => void;
  onResult: (symbol: string, fullName: string, logoURL?: string) => void;
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

  const onSelectResult = (symbol, fullName, logoURL) => {
    if (symbol) {
      if (!fullName) {
        onError("We can't find that company. Please contact support.");
        return;
      }

      onResult(symbol, fullName, logoURL ?? undefined);

      if (clearOnSelection) {
        setSymbol('');
      }
    }

    setSearchResults([]);
  };

  return (
    <>
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
          <FloatingSearchResults onSelect={onSelectResult} searchResults={searchResults} />
        ) : (
          <FlatSearchResults onSelect={onSelectResult} searchResults={searchResults} />
        )}
      </div>
    </>
  );
};

export default TextInputWithResults;
