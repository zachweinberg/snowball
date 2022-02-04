import { trackGoal } from 'fathom-client';
import React, { useCallback, useEffect, useState } from 'react';
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';
import { API } from '~/lib/api';
import Button from '../ui/Button';

const PlaidLink: React.FunctionComponent = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token, metadata) => {
    const response = await API.exchangePlaidTokenAndFetchHoldings(public_token);
    console.log(response);
  }, []);

  const config: PlaidLinkOptions = {
    token: linkToken ?? '',
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    API.getPlaidLinkToken().then((response) => {
      localStorage.setItem('link_token', response.data.link_token);
      setLinkToken(response.data.link_token);
    });
  }, []);

  return !linkToken ? (
    <Button type="button" className="w-60" onClick={() => null} disabled>
      Import Automatically
    </Button>
  ) : (
    <Button
      type="button"
      className="w-60"
      onClick={() => {
        trackGoal('JALIKOJQ', 0);
        open();
      }}
      // disabled={!ready || !linkToken}
      disabled
    >
      Import Automatically
    </Button>
  );
};

export default PlaidLink;
