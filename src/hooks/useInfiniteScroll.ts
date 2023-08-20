import { Ref, useEffect, useState } from 'react';

import { useIsVisible } from './useIsVisible';
import { usePrevious } from './usePrevious';

export type FetchMoreOpts = {
  pageSize: number;
  currentPageNumber: number;
};

/**
 * fetchMore should fetch more results and update any state tied to your UI
 * returns how many items it fetched and if there is a next page
 */
export type FetchMore<T> = (_opts: FetchMoreOpts) => Promise<{
  itemsFetched: number;
  hasNextPage: boolean;
  data: T | null;
}>;

export type UseInfiniteScrollOpts<T> = {
  pageSize: number;
  itemLimit: number;
  initialItemsLoaded: number;
  initialHasNextPage?: boolean;
  fetchMore: FetchMore<T>;
};

export type UseInfiniteScrollResult<T extends Element> = {
  /**
   * A ref to a "trigger" element
   * Whenever the trigger element is visible (i.e. in the viewport)
   * this hook will automatically fetch another page
   * Often assigned to a loading indicator underneath your results
   */
  scrollTriggerRef: Ref<T>;
  hasNextPage: boolean;
  pageNumber: number;
  totalItemsLoaded: number;
  limitReached: boolean;
};

export function useInfiniteScroll<T extends Element, D>({
  pageSize,
  itemLimit,
  fetchMore,
  initialItemsLoaded,
  initialHasNextPage = true,
}: UseInfiniteScrollOpts<D>): UseInfiniteScrollResult<T> {
  const { isVisible, ref } = useIsVisible<T>({});
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalItemsLoaded, setTotalItemsLoaded] = useState(initialItemsLoaded);
  const [limitReached, setLimitReached] = useState(
    initialItemsLoaded >= itemLimit
  );

  const previousVisible = usePrevious(isVisible);

  useEffect(() => {
    // When the trigger transitions to visible, fetch more items
    async function fetchMoreIfVisible() {
      if (isVisible && !previousVisible) {
        const { itemsFetched, hasNextPage: fetchHasNextPage } = await fetchMore(
          {
            currentPageNumber: pageNumber,
            pageSize,
          }
        );
        const isLimitReached = totalItemsLoaded + itemsFetched >= itemLimit;
        setPageNumber((curr) => curr + 1);
        setHasNextPage(fetchHasNextPage && !isLimitReached);
        setTotalItemsLoaded((curr) => curr + itemsFetched);
        setLimitReached(isLimitReached);
      }
    }
    fetchMoreIfVisible();
  }, [
    fetchMore,
    isVisible,
    itemLimit,
    pageNumber,
    pageSize,
    previousVisible,
    totalItemsLoaded,
  ]);

  return {
    hasNextPage,
    limitReached,
    pageNumber,
    scrollTriggerRef: ref,
    totalItemsLoaded,
  };
}
