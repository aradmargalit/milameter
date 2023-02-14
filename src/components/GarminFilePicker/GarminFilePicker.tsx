import { Stack, Typography } from '@mui/joy';
import { ChangeEventHandler, useRef, useState } from 'react';
import ErrorAlert from '../ErrorAlert';

// TODO: migrate UI to a pure component and separate logic into container
export function GarminFilePicker() {
  const filePickerRef = useRef<HTMLInputElement>(null);
  const [files, setFileList] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // inspired 😉 by https://github.com/meinstein/react-sage/blob/master/src/useFilePicker.tsx
  const handleChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    // always clear errors & reset files
    setErrors([]);
    setFileList([]);

    const target = event.target;
    const files = target.files;

    if (!files || !files.length) {
      setErrors(['No files uploaded']);
      return;
    }

    const fileList = Array.from(files);

    // set local state so we know how many files we have
    setFileList(fileList);
  };

  return (
    <Stack spacing={2}>
      <label htmlFor="file-picker">
        <Typography level="h3">Please select your .fit files</Typography>
      </label>
      <Typography level="body1">TODO: update style</Typography>

      <input
        ref={filePickerRef}
        id="file-picker"
        type="file"
        accept=".fit"
        multiple
        onChange={handleChange}
      />
      {errors.length ? <ErrorAlert errors={errors} /> : null}
      {files.length ? (
        <Typography>
          You have selected {files.length} file{files.length > 1 ? 's' : ''}
        </Typography>
      ) : null}
    </Stack>
  );
}
