import { Card, Chip, Stack } from '@mui/joy';

import { DOG_COLOR, HUMAN_COLOR } from '@/colors';

export function Legend() {
  return (
    <Card
      sx={{
        position: 'relative',
        bottom: '70%',
        left: '80%',
        width: 115,
        height: 70,
        border: '2px solid black',
        padding: 1,
      }}
    >
      <Stack>
        <Chip
          size="sm"
          sx={{
            backgroundColor: HUMAN_COLOR,
            mb: 0.5,
            border: '1px solid black',
          }}
        >
          🏃‍♂️ Human
        </Chip>
        <Chip
          size="sm"
          sx={{ backgroundColor: DOG_COLOR, border: '1px solid black' }}
        >
          🐶 Dog
        </Chip>
      </Stack>
    </Card>
  );
}
