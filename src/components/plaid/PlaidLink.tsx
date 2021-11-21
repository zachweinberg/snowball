import React, { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { API } from '~/lib/api';
import Button from '../ui/Button';

const PlaidLink: React.FunctionComponent = () => {
  const [linkToken, setLinkToken] = useState(null);

  const generateToken = async () => {
    const response = (await API.getPlaidLinkToken()) as any;

    console.log(response);

    setLinkToken(response.data.link_token);
  };

  useEffect(() => {
    generateToken();
  }, []);

  return !linkToken ? (
    <Button type="button" className="w-60" onClick={() => open()} disabled>
      Import automatically
    </Button>
  ) : (
    <Link linkToken={linkToken} />
  );
};

export default PlaidLink;

interface LinkProps {
  linkToken: string | null;
}

const Link: React.FunctionComponent<LinkProps> = ({ linkToken }: LinkProps) => {
  const onSuccess = useCallback(async (public_token, metadata) => {
    const response = (await API.exchangePlaidTokenAndFetchHoldings(public_token)) as any;
    console.log(response);
  }, []);

  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken!,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <Button
      type="button"
      className="w-60"
      onClick={() => open()}
      disabled={!ready || !linkToken}
    >
      Import automatically
    </Button>
  );
};
