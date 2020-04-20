// custom useFetch hook for querying the 200 OK admin API

import { useState, useEffect } from '../preact-htm.js';

export default function useFetch(url, method, useCredentials = true) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [needRefetch, setNeedRefetch] = useState(false);

  const refetch = () => {
    setNeedRefetch(true);
  };

  useEffect(() => {
    setNeedRefetch(false);
    const fetchData = async () => {
      const options = {
        method,
      };
      if (useCredentials) options.credentials = 'include';

      try {
        const response = await fetch(url, options);
        const responseData = await response.json();
        if (responseData) {
          setData(responseData);
        } else {
          setError('No data to fetch.');
        }
        setIsLoading(false);
      } catch (err) {
        setError('Could not fetch data.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [needRefetch]);

  return {
    data,
    error,
    isLoading,
    refetch,
  };
}
