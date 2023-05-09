import { Ref, useEffect, useState } from 'react';

import { useIsVisible } from './useIsVisible';

type FetchMoreOpts = {
  pageSize: number;
  pageNumber: number;
};
/**
 * fetchMore should fetch more results
 * returns show many items it fetched and if there is a next page
 */
export type FetchMore = (_opts: FetchMoreOpts) => Promise<{
  itemsFetched: number;
  hasNextPage: boolean;
}>;

export type UseInfiniteScrollOpts = {
  pageSize: number;
  itemLimit: number;
  initialItemsLoaded: number;
  initialHasNextPage?: boolean;
  fetchMore: FetchMore;
};

export type UseInfiniteScrollResult<T extends Element> = {
  /** A ref to the element which triggers another page fetch */
  scrollTriggerRef: Ref<T | null>;
  hasNextPage: boolean;
  pageNumber: number;
  totalItemsLoaded: number;
  limitReached: boolean;
};

export function useInfiniteScroll<T extends Element>({
  pageSize,
  itemLimit,
  fetchMore,
  initialItemsLoaded,
  initialHasNextPage = true,
}: UseInfiniteScrollOpts): UseInfiniteScrollResult<T> {
  const { isVisible, ref } = useIsVisible<T>({});
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalItemsLoaded, setTotalItemsLoaded] = useState(initialItemsLoaded);
  const [limitReached, setLimitReached] = useState(
    initialItemsLoaded >= itemLimit
  );
  const [fetchedPageMap, setFetchedPageMap] = useState(
    new Map<number, boolean>()
  );

  // When the trigger transitions to visible, fetch more items
  useEffect(() => {
    async function fetchMoreIfVisible() {
      // fetchedPageMap is a hack to make sure we don't fetch the same page more than once
      if (isVisible && !fetchedPageMap.get(pageNumber)) {
        fetchedPageMap.set(pageNumber, true);
        setFetchedPageMap(fetchedPageMap);

        const { itemsFetched, hasNextPage: fetchHasNextPage } = await fetchMore(
          {
            pageSize,
            pageNumber,
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
    fetchedPageMap,
    isVisible,
    itemLimit,
    pageNumber,
    pageSize,
    totalItemsLoaded,
  ]);

  return {
    scrollTriggerRef: ref,
    hasNextPage,
    pageNumber,
    totalItemsLoaded,
    limitReached,
  };
}
