import { Stack, Typography } from '@mui/joy';
import { ChangeEventHandler } from 'react';

import FilePicker from '../FilePicker';

type GarminFilePickerProps = {
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export function GarminFilePicker({ onChange }: GarminFilePickerProps) {
  return (
    <Stack
      spacing={{ md: 2, xs: 1 }}
      direction={{ md: 'row', xs: 'column' }}
      alignItems="center"
    >
      <label htmlFor="file-picker">
        <Typography level="title-lg" component="h2">
          Please select your .fit files
        </Typography>
      </label>
      <FilePicker
        id="file-picker"
        buttonProps={{
          variant: 'soft',
        }}
        accept=".fit"
        onChange={onChange}
      />
    </Stack>
  );
}
