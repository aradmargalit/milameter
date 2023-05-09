import { Typography } from '@mui/joy';

type NoMoreResultsProps = {
  limit?: number | undefined;
};
export function NoMoreResults({ limit }: NoMoreResultsProps) {
  const message = limit ? `You hit the ${limit} item limit` : 'No more results';
  return <Typography>{message}</Typography>;
}
