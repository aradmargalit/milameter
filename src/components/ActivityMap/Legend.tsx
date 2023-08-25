import { Card, Chip, Stack } from '@mui/joy';

import { DOG_COLOR, HUMAN_COLOR } from '@/colors';
import { useActivityPair } from '@/contexts/ActivityPairContext/ActivityPairContext';

type LegendChipProps = {
  backgroundColor: string;
  text: string;
  hasBottomMargin?: boolean;
};

function LegendChip({
  text,
  backgroundColor,
  hasBottomMargin = true,
}: LegendChipProps) {
  return (
    <Chip
      size="sm"
      sx={{
        backgroundColor: backgroundColor,
        border: '1px solid black',
        mb: hasBottomMargin ? 0.5 : 0,
      }}
    >
      {text}
    </Chip>
  );
}

export function Legend() {
  const { derivedActivityProperties } = useActivityPair();
  return (
    <Card
      sx={{
        border: '2px solid black',
        bottom: '70%',
        left: '80%',
        padding: 1,
        position: 'relative',
        width: 115,
      }}
    >
      <Stack>
        <LegendChip backgroundColor={HUMAN_COLOR} text="Human" />
        <LegendChip backgroundColor={DOG_COLOR} text="Dog" />
        {derivedActivityProperties?.zoomies.length && (
          <LegendChip backgroundColor="gray" text="Zoom 💨" />
        )}
      </Stack>
    </Card>
  );
}
