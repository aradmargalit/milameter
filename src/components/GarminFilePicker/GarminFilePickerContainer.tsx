import { ChangeEventHandler, useState } from 'react';

import { useGarminActivities } from '@/contexts/GarminActivityContext';

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

  return <GarminFilePicker onChange={handleChange} errors={errors} />;
}
