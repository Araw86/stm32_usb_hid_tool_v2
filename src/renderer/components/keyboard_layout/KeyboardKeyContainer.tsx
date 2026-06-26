import React from 'react';

import { KEYBOARD_KEY_ARRAY } from '../../../shared/config/imageArrayConf';
import { Box, Typography } from '@mui/material';
import KeyAnalogChartDialog from './KeyAnalogChartDialog';
import { registerAnalogRef } from './keyAnalogDisplay';

interface KeyboardKeyContainer {
  sKeyboardKey: string;
}

const KeyboardKeyContainer: React.FC<KeyboardKeyContainer> = ({
  sKeyboardKey,
}) => {
  const nKeyboardKeyId = KEYBOARD_KEY_ARRAY[sKeyboardKey].nKeyId;
  const sKeyboardKeyText = KEYBOARD_KEY_ARRAY[sKeyboardKey].keyText;

  const analogRef = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    registerAnalogRef(nKeyboardKeyId, analogRef.current);
    return () => registerAnalogRef(nKeyboardKeyId, null);
  }, [nKeyboardKeyId]);

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Box
        onClick={() => setOpen(true)}
        sx={{
          width: '100%',
          height: '100%',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': { backgroundColor: 'action.hover' },
          borderRadius: 1,
        }}
      >
        <Typography>{sKeyboardKeyText}</Typography>
        <Typography fontSize={'0.750rem'} component="span">
          <span ref={analogRef}>0</span>
        </Typography>
      </Box>
      <KeyAnalogChartDialog
        open={open}
        onClose={() => setOpen(false)}
        keyId={nKeyboardKeyId}
        keyLabel={sKeyboardKeyText}
      />
    </>
  );
};

export default React.memo(KeyboardKeyContainer);
