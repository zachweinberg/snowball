import debounce from 'lodash/debounce';
import { useCallback, useEffect, useRef, useState } from 'react';
import TextInput from './TextInput';

interface SearchResultsProps {
  results: any[];
  onOutsideClick: () => void;
  onSelection: (selection: any) => void;
  labelKey: string;
}

const SearchResults: React.FunctionComponent<SearchResultsProps> = ({
  results,
  onSelection,
  onOutsideClick,
  labelKey,
}: SearchResultsProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleClick = (e) => {
    if (ref.current && ref.current.contains(e.target)) {
      return;
    }
    onOutsideClick();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="absolute left-0 right-0 z-50 flex flex-col overflow-hidden bg-white border rounded-md border-gray top-16"
    >
      {results.map((result, i) => (
        <div
          onClick={() => onSelection(result)}
          key={i}
          className="flex px-3 py-3 bg-gray-100 border-b cursor-pointer border-gray hover:bg-lightlime"
        >
          <p className="text-md">{result[labelKey]}</p>
        </div>
      ))}
    </div>
  );
};

interface Props {
  onSubmit: (placeID: string) => void;
}

interface GooglePrediction {
  description: string;
  place_id: string;
}

const requestPredictions = (input: string): Promise<GooglePrediction[]> => {
  return new Promise((resolve, reject) => {
    if (!window) {
      return resolve([]);
    }

    if (!window.google) {
      return reject();
    }

    const service = new window.google.maps.places.AutocompleteService();

    service.getPlacePredictions(
      { input, componentRestrictions: { country: 'us' } },
      (
        predictions: GooglePrediction[] | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
          console.error('Could not search places');
          return resolve([]);
        }
        return resolve(predictions.slice(0, 4));
      }
    );
  });
};

const AddressSearch: React.FunctionComponent<Props> = ({ onSubmit }: Props) => {
  const [address, setAddress] = useState('');
  const [results, setResults] = useState<GooglePrediction[]>([]);

  const searchAddresses = async (address: string) => {
    const results = await requestPredictions(address);
    setResults(results);
  };

  const clearSearch = () => {
    setAddress('');
    setResults([]);
  };

  const debouncedAddressSearch = useCallback(
    debounce((q) => searchAddresses(q), 120),
    []
  );

  const onTypeAddress = (event) => {
    const address = event.target.value;
    setAddress(address);

    if (address.length > 0) {
      debouncedAddressSearch(address);
    } else {
      clearSearch();
    }
  };

  return (
    <div className="relative w-full">
      <TextInput
        type="text"
        placeholder="Address"
        value={address}
        onChange={onTypeAddress}
        name="address"
        className="mb-4"
      />

      {results && results.length > 0 && (
        <SearchResults
          results={results}
          onOutsideClick={clearSearch}
          onSelection={(location) => {
            setAddress(location.description);
            setResults([]);
            onSubmit(location.place_id);
          }}
          labelKey="description"
        />
      )}
    </div>
  );
};

export default AddressSearch;
