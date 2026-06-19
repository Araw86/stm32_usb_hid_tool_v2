import React from 'react';

import { useSelector } from 'react-redux';
import { RootState } from '../../store/storeRenderer';
import { KEYBOARD_KEY_ARRAY } from '../../../shared/config/imageArrayConf';
import { Box, Typography } from '@mui/material';
import KeyAnalogChartDialog from './KeyAnalogChartDialog';

interface KeyboardKeyContainer {
  sKeyboardKey: string;
}

const KeyboardKeyContainer: React.FC<KeyboardKeyContainer> = ({
  sKeyboardKey,
}) => {
  const nKeyboardKeyId = KEYBOARD_KEY_ARRAY[sKeyboardKey].nKeyId;
  const sKeyboardKeyText = KEYBOARD_KEY_ARRAY[sKeyboardKey].keyText;
  const nKeyboardAnalogValue: number = useSelector((state: RootState) => {
    return state.keyboardKeysStateSlice.aKeyAnalogState[nKeyboardKeyId];
  });

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
        <Typography fontSize={'0.750rem'}>{nKeyboardAnalogValue}</Typography>
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

export default KeyboardKeyContainer;
