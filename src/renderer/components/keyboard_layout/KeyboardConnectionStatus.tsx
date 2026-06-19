import React from 'react';
import { Chip } from '@mui/material';
import UsbIcon from '@mui/icons-material/Usb';
import UsbOffIcon from '@mui/icons-material/UsbOff';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/storeRenderer';

const KeyboardConnectionStatus: React.FC = () => {
  const bConnected = useSelector(
    (state: RootState) => state.testSlice.connectState
  );

  return (
    <Chip
      icon={bConnected ? <UsbIcon /> : <UsbOffIcon />}
      label={bConnected ? 'Keyboard connected' : 'Keyboard not detected'}
      color={bConnected ? 'success' : 'default'}
      variant={bConnected ? 'filled' : 'outlined'}
      size="small"
      sx={{ fontWeight: 500 }}
    />
  );
};

export default KeyboardConnectionStatus;
