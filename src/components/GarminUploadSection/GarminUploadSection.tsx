import { Box } from '@mui/system';

import { GarminFilePickerContainer } from '../GarminFilePicker/GarminFilePickerContainer';
import GarminUploadInstructions from '../GarminUploadInstructions';

export function GarminUploadSection() {
  return (
    <Box
      border="1px solid var(--joy-palette-neutral-outlinedBorder)"
      borderRadius="var(--joy-radius-md)"
      padding={2}
    >
      <GarminUploadInstructions />
      <GarminFilePickerContainer />
    </Box>
  );
}
