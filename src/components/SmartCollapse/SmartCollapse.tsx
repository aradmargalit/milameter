import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import { Box, Button, Stack, useTheme } from '@mui/joy';
import { ReactNode, useState } from 'react';

export type SmartCollapseProps = {
  children: ReactNode;
  approxHeightPx: number;
};

export function SmartCollapse({
  children,
  approxHeightPx,
}: SmartCollapseProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed((collapsed) => !collapsed);
  };
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
            transform: collapsed ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease-in-out',
          }}
        />
      </Button>
      <Box
        sx={{
          height: collapsed ? 0 : approxHeightPx,
          overflow: 'hidden',
          transition: 'height 0.2s ease-in-out',
        }}
      >
        {children}
      </Box>
    </Stack>
  );
}
