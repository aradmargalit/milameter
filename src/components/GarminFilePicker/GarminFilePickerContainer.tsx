import { Box, Stack } from '@mui/joy';
import { ChangeEventHandler, useState } from 'react';

import { useGarminActivities } from '@/contexts/GarminActivityContext';

import ErrorAlert from '../ErrorAlert';
import StoredActivityIndicator from '../StoredActivityIndicator';
import { GarminFilePicker } from './GarminFilePicker';

export function GarminFilePickerContainer() {
  const [errors, setErrors] = useState<string[]>([]);
  const { uploadActivities } = useGarminActivities();

  // inspired 😉 by https://github.com/meinstein/react-sage/blob/master/src/useFilePicker.tsx
  const handleChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    // always clear errors & reset files
    setErrors([]);

    const target = event.target;
    const files = target.files;

    if (!files || !files.length) {
      setErrors(['No files uploaded']);
      return;
    }

    const fileList = Array.from(files);

    // send files to context
    // this can fail if local storage is full
    // TODO: make local storage evict keys
    try {
      await uploadActivities(fileList);
    } catch (e) {
      setErrors(['Upload failed. Try clearing activities and trying again.']);
    }
  };

  return (
    <Stack gap={2}>
      <Stack direction={{ md: 'row', xs: 'column' }} gap={2}>
        <GarminFilePicker onChange={handleChange} />
        <StoredActivityIndicator />
      </Stack>
      {errors.length ? (
        <Box maxWidth="50%">
          <ErrorAlert errors={errors} />
        </Box>
      ) : null}
    </Stack>
  );
}
