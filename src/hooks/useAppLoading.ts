import { Router } from 'next/router';
import { useEffect, useState } from 'react';

type UseAppLoadingResult = {
  loading: boolean;
};

/**
 * Returns a loading boolean that can be used to show a loading state
 * while Next transitions pages
 */
export function useAppLoading(): UseAppLoadingResult {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const start = () => setLoading(true);
    const end = () => setLoading(false);

    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);
    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);

  return { loading };
}
