import { Ref, useEffect, useState } from 'react';

import { useIsVisible } from './useIsVisible';

export type UseInfiniteScrollOpts = {
  pageSize: number;
  itemLimit: number;
  initialItemsLoaded: number;
  initialHasNextPage?: boolean;
};

export type UseInfiniteScrollResult<T extends Element> = {
  /** A ref to the element which triggers another page fetch */
  scrollTriggerRef: Ref<T | null>;
  hasNextPage: boolean;
  pageNumber: number;
  totalItemsLoaded: number;
};

export function useInfiniteScroll<T extends Element>({
  pageSize,
  itemLimit,
  initialItemsLoaded,
  initialHasNextPage = true,
}: UseInfiniteScrollOpts): UseInfiniteScrollResult<T> {
  const { isVisible, ref } = useIsVisible<T>({});
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalItemsLoaded, setTotalItemsLoaded] = useState(initialItemsLoaded);

  // When the trigger transitions to visible, fetch more items
  useEffect(() => {
    if (isVisible) {
      console.log('fetchmore');
    }
  }, [isVisible]);

  return {
    scrollTriggerRef: ref,
    hasNextPage,
    pageNumber,
    totalItemsLoaded,
  };
}
