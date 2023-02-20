import { Stack, Typography } from '@mui/joy';
import { ChangeEventHandler } from 'react';

import ErrorAlert from '../ErrorAlert';
import FilePicker from '../FilePicker';

type GarminFilePickerProps = {
  onChange: ChangeEventHandler<HTMLInputElement>;
  errors: string[];
};

export function GarminFilePicker({ onChange, errors }: GarminFilePickerProps) {
  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <label htmlFor="file-picker">
        <Typography level="h5">Please select your .fit files</Typography>
      </label>
      <FilePicker
        id="file-picker"
        buttonProps={{
          variant: 'soft',
        }}
        accept=".fit"
        onChange={onChange}
      />
      {errors.length ? <ErrorAlert errors={errors} /> : null}
    </Stack>
  );
}
