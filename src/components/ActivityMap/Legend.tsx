import { Card, Chip, Stack } from '@mui/joy';

import { DOG_COLOR, HUMAN_COLOR } from '@/colors';

export function Legend() {
  return (
    <Card
      sx={{
        border: '2px solid black',
        bottom: '70%',
        height: 70,
        left: '80%',
        padding: 1,
        position: 'relative',
        width: 115,
      }}
    >
      <Stack>
        <Chip
          size="sm"
          sx={{
            backgroundColor: HUMAN_COLOR,
            border: '1px solid black',
            mb: 0.5,
          }}
        >
          Human
        </Chip>
        <Chip
          size="sm"
          sx={{ backgroundColor: DOG_COLOR, border: '1px solid black' }}
        >
          Dog
        </Chip>
      </Stack>
    </Card>
  );
}
