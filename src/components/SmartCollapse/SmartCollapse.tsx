import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import { Box, Button, Stack, useTheme } from '@mui/joy';
import { ReactNode, useEffect, useState } from 'react';

import { useUserPreferences } from '@/contexts/UserPreferencesContext';

import { SmartCollapseKey, smartCollapses } from './smartCollapses';

export type SmartCollapseProps = {
  children: ReactNode;
  /**
   * Height must be manually set for transitions to work properly
   */
  approxHeightPx: number;
  /**
   * If you want the collapsed state to be persisted to local storage,
   * pass an id for this section
   */
  id?: SmartCollapseKey;
};

export function SmartCollapse({
  children,
  approxHeightPx,
  id,
}: SmartCollapseProps) {
  const initiallyCollapsed =
    smartCollapses.find((x) => x.key === id)?.isDefaultCollapsed ?? false;
  const [collapsed, setCollapsed] = useState(initiallyCollapsed);
  const {
    userPrefs: { collapsedSections },
    updateUserPrefs,
  } = useUserPreferences();

  useEffect(() => {
    if (id) {
      setCollapsed(collapsedSections[id]);
    }
  }, [collapsedSections, id]);

  const toggle = () => {
    setCollapsed((collapsed) => !collapsed);
    if (id) {
      updateUserPrefs({
        collapsedSections: {
          // DANGER! This value can be stale, need to fix this.
          ...collapsedSections,
          [id]: !collapsed,
        },
      });
    }
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
