import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import { Box, Button, Stack, useTheme } from '@mui/joy';
import { ReactNode } from 'react';

export type CollapseProps = {
  children: ReactNode;
  /**
   * Height must be manually set for transitions to work properly
   */
  approxHeightPx: number;
  open: boolean;
  toggle: () => void;
};

export function Collapse({
  children,
  approxHeightPx,
  open,
  toggle,
}: CollapseProps) {
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={2} sx={{}}>
      <Button
        variant="plain"
        sx={{
          background: theme.palette.background.backdrop,
        }}
        onClick={toggle}
      >
        <ChevronRightOutlined
          sx={{
            transform: open ? 'rotate(0deg)' : 'rotate(90deg)',
            transition: 'transform 0.2s ease-in-out',
          }}
        />
      </Button>
      <Box
        sx={{
          height: open ? approxHeightPx : 0,
          overflow: 'hidden',
          transition: 'height 0.2s ease-in-out',
        }}
      >
        {children}
      </Box>
    </Stack>
  );
}
