import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client.js';


export const useFetch = (path) => {
  const [state, setState] = useState({ data: null, loading: Boolean(path), error: null });
  const [tick, setTick] = useState(0);
  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!path) return undefined;
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    api(path, { signal: controller.signal })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ data: null, loading: false, error });
      });
    return () => controller.abort();
  }, [path, tick]);

  return { ...state, reload };
};
