import { Ref, useEffect, useState } from 'react';

import { useIsVisible } from './useIsVisible';

type FetchMoreOpts = {
  pageSize: number;
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

  // When the trigger transitions to visible, fetch more items
  useEffect(() => {
    async function fetchMoreIfVisible() {
      if (isVisible) {
        const { itemsFetched, hasNextPage: fetchHasNextPage } = await fetchMore(
          {
            pageSize,
          }
        );
        setPageNumber((curr) => curr++);
        setHasNextPage(fetchHasNextPage);
        setTotalItemsLoaded((curr) => (curr += itemsFetched));
      }
    }
    fetchMoreIfVisible();
  }, [isVisible]);

  return {
    scrollTriggerRef: ref,
    hasNextPage,
    pageNumber,
    totalItemsLoaded,
  };
}
