import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { Box, Button, Stack } from '@mui/joy';
import { ReactNode } from 'react';

export type CollapseProps = {
  children: ReactNode;
  /**
   * Height must be manually set for transitions to work properly
   */
  approxHeightPx: number;
  open: boolean;
  toggle: () => void;
  buttonAriaLabel: string;
};

export function Collapse({
  children,
  approxHeightPx,
  open,
  toggle,
  buttonAriaLabel,
}: CollapseProps) {
  return (
    <Stack direction="row" spacing={2}>
      <Button variant="outlined" onClick={toggle} aria-label={buttonAriaLabel}>
        <InfoOutlined />
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
