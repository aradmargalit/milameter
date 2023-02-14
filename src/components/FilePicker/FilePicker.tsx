import { FileUploadOutlined } from '@mui/icons-material';
import { Button } from '@mui/joy';
import { ChangeEventHandler, useRef } from 'react';

type FilePickerProps = {
  id: string;
  buttonProps: Partial<React.ComponentProps<typeof Button>>;
  accept: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  buttonText?: string;
  multiple?: boolean;
};

/**
 * Renders a Joy button instead of the native file picker
 */
export function FilePicker({
  id,
  buttonProps,
  accept,
  onChange,
  multiple = true,
  buttonText = 'Choose files',
}: FilePickerProps) {
  const filePickerRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        sx={{ width: '10rem' }}
        startDecorator={<FileUploadOutlined />}
        {...buttonProps}
        onClick={() => filePickerRef.current?.click()}
      >
        {buttonText}
      </Button>
      <input
        ref={filePickerRef}
        id={id}
        style={{ display: 'none' }}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={onChange}
      />
    </>
  );
}
