import { useGarminActivities } from '@/contexts/GarminActivityContext';
import { Stack, Typography } from '@mui/joy';
import { ChangeEventHandler, useState } from 'react';
import ErrorAlert from '../ErrorAlert';
import FilePicker from '../FilePicker';

// TODO: migrate UI to a pure component and separate logic into container
export function GarminFilePicker() {
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
    uploadActivities(fileList);
  };

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
        onChange={handleChange}
      />
      {errors.length ? <ErrorAlert errors={errors} /> : null}
    </Stack>
  );
}
