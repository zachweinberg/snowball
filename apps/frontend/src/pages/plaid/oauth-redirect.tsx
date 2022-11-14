import { AssetType } from 'schema';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';
import { API } from '~/lib/api';

const PlaidOAuthRedirect = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const router = useRouter();

  const isOAuthRedirect = window.location.href.includes('?oauth_state_id=');

  useEffect(() => {
    if (isOAuthRedirect) {
      setLinkToken(localStorage.getItem('link_token'));
      return;
    }

    if (!isOAuthRedirect) {
      router.push('/');
      return;
    }

    API.getPlaidLinkToken(AssetType.Cash).then(({ data }) => {
      localStorage.setItem('link_token', data.link_token);
      setLinkToken(data.link_token);
    });
  }, []);

  const onSuccess = useCallback<PlaidLinkOnSuccess>((publicToken, metadata) => {
    console.log(publicToken, metadata);
  }, []);

  const config: PlaidLinkOptions = {
    token: linkToken ?? '',
    onSuccess,
  };

  if (isOAuthRedirect) {
    config.receivedRedirectUri = window.location.href;
  }

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (isOAuthRedirect && ready) {
      open();
    }
  }, [ready, open, isOAuthRedirect]);

  return isOAuthRedirect ? <></> : null;
};

export default PlaidOAuthRedirect;
