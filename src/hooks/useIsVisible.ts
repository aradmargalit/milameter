import { Ref, useCallback, useEffect, useRef, useState } from 'react';

export type UseIsVisibleResult<T extends Element> = {
  ref: Ref<T | null>;
  isVisible: boolean | null;
};

export type UseIsVisibleOpts = {
  onObserve?: IntersectionObserverCallback | undefined;
};

const observerOptions: IntersectionObserverInit = {
  // null defaults to the viewport
  root: null,
  // undefined is the same as no margin
  rootMargin: undefined,
  // 0 -> trip when 0% of the element is visible
  // 1 -> trip when 100% of the element is visible
  threshold: 1,
};

export function useIsVisible<T extends Element>({
  onObserve,
}: UseIsVisibleOpts): UseIsVisibleResult<T> {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState<boolean | null>(null);

  const handleObserved: IntersectionObserverCallback = useCallback(
    (entries, observer) => {
      onObserve?.(entries, observer);

      setIsVisible(entries[0].isIntersecting);
    },
    [onObserve]
  );

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const currentRef = ref.current;

    const observer = new IntersectionObserver(handleObserved, observerOptions);
    observer.observe(currentRef);

    return () => observer.unobserve(currentRef);
  }, [handleObserved]);

  return {
    isVisible,
    ref,
  };
}
