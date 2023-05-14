import { CircularProgress, CircularProgressProps } from '@mui/joy';

type LoadingIndicatorProps = {} & CircularProgressProps;

export function LoadingIndicator(props: LoadingIndicatorProps) {
  return <CircularProgress {...props} aria-label="loading indicator" />;
}
