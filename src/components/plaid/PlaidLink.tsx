import React, { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { API } from '~/lib/api';

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

  return linkToken != null ? <Link linkToken={linkToken} /> : <></>;
};

interface LinkProps {
  linkToken: string | null;
}

const Link: React.FunctionComponent<LinkProps> = (props: LinkProps) => {
  const onSuccess = useCallback(async (public_token, metadata) => {
    const response = (await API.exchangePlaidTokenAndFetchHoldings(public_token)) as any;
    console.log(response);
  }, []);

  const config: Parameters<typeof usePlaidLink>[0] = {
    token: props.linkToken!,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <button onClick={() => open()} disabled={!ready}>
      Link account
    </button>
  );
};

export default PlaidLink;
