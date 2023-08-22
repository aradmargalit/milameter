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
      data: newActivities,
      hasNextPage: newActivities.length > 0,
      itemsFetched: newActivities.length,
    };
  } catch (e) {
    return {
      data: null,
      hasNextPage: false,
      itemsFetched: 0,
    };
  }
};
