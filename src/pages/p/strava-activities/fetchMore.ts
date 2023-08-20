import { FetchMore } from '@/hooks/useInfiniteScroll';
import { Activity } from '@/models/activity';

export const fetchMore: FetchMore<Activity[]> = async ({
  pageSize,
  currentPageNumber,
}) => {
  try {
    const res = await fetch(
      `/api/milameter/getActivities?pageSize=${pageSize}&pageNumber=${
        currentPageNumber + 1
      }`
    );

    const { message } = await res.json();
    const newActivities = message.activities as Activity[];

    return {
      itemsFetched: newActivities.length,
      hasNextPage: newActivities.length > 0,
      data: newActivities,
    };
  } catch (e) {
    return {
      itemsFetched: 0,
      hasNextPage: false,
      data: null,
    };
  }
};
