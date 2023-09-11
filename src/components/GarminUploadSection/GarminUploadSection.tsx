import { Box } from '@mui/system';

import { GarminFilePickerContainer } from '../GarminFilePicker/GarminFilePickerContainer';
import GarminUploadInstructions from '../GarminUploadInstructions';

export function GarminUploadSection({
  instructionsOpen,
}: {
  instructionsOpen: boolean;
}) {
  return (
    <Box
      border="1px solid var(--joy-palette-neutral-outlinedBorder)"
      borderRadius="var(--joy-radius-md)"
      padding={{ md: 2, xs: 1 }}
    >
      <GarminUploadInstructions instructionsOpen={instructionsOpen} />
      <GarminFilePickerContainer />
    </Box>
  );
}
