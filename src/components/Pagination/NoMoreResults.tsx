import { Typography } from '@mui/joy';

type NoMoreResultsProps = {
  limit: number;
};
export function NoMoreResults({ limit }: NoMoreResultsProps) {
  return (
    <Typography>
      You&apos;ve reached the end or hit the {limit} item limit.
    </Typography>
  );
}
