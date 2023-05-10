import { useEffect, useRef } from 'react';

// https://usehooks.com/usePrevious/
export function usePrevious<T>(value: T) {
  const ref = useRef();
  // Store current value in ref
  useEffect(() => {
    // @ts-ignore
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
