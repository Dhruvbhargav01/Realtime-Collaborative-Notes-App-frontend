// frontend/src/hooks/useAutosave.js
import { useEffect, useRef } from 'react';

export default function useAutosave(callback, deps = [], interval = 5000) {
  const savedCallback = useRef();

  useEffect(() => { savedCallback.current = callback; }, [callback]);

  useEffect(() => {
    const tick = () => savedCallback.current && savedCallback.current();
    const id = setInterval(tick, interval);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
