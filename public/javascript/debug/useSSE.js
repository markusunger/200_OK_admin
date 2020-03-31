/* eslint-disable import/extensions */

import { useState, useEffect } from '../preact-htm.js';

export default function useSSE(apiName) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      try {
        const result = JSON.parse(e.data);
        setData(result);
      } catch (error) {
        console.error(error);
      }
    };

    const sse = new EventSource(`/api/debug-stream/${apiName}`);
    sse.addEventListener('message', handler);

    return function cleanup() {
      sse.removeEventListener('message', handler);
    };
  }, []);

  return data;
}
