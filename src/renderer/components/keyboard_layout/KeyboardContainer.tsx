import React from 'react';
import { Box } from '@mui/material';
import { Key } from '@mui/icons-material';
import KeyboardGridNumComponent from './KeyboardNumGridComponent';
import KeyboardGridComponent from './KeyboardGridComponent';
import KeyboardKeyContainer from './KeyboardKeyContainer';
interface KeyboardContainerProps {}

const mainKeyLayout: (string | null)[][] = [
  [
    'Esc',
    null,
    'F1',
    'F2',
    'F3',
    'F4',
    null,
    'F5',
    'F6',
    'F7',
    'F8',
    null,
    'F9',
    'F10',
    'F11',
    'F12',
  ],
  [
    '`',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
    '-',
    '=',
    'Backspace',
  ],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
  ['ShiftL', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'ShiftR'],
  ['CtrlL', 'Win', 'AltL', 'Space', 'AltR', 'Fn', 'Code', 'CtrlR'],
];

const mainKeySpanMap: Record<string, number> = {
  Backspace: 1.9,
  Tab: 1.5,
  Caps: 1.75,
  Enter: 2.25,
  ShiftL: 2.25,
  ShiftR: 2.75,
  Space: 5.9,
  CtrlL: 1.5,
  CtrlR: 1.5,
  Win: 1.5,
  AltL: 1.5,
  AltR: 1.5,
  Fn: 1.5,
  Code: 1.5,
};

const navLayout: (string | null)[][] = [
  ['Print', 'Scroll', 'Pause'],
  ['Insert', 'Home', 'PageUp'],
  ['Delete', 'End', 'PageDown'],
  [null, null, null],
  [null, 'ArrowUp', null],
  ['ArrowLeft', 'ArrowDown', 'ArrowRight'],
];

const numpadLayout: (string | null)[][] = [
  ['FnA', 'FnB', 'FnC', 'FnD'],
  ['NumLock', '/N', '*N', '-N'],
  ['7N', '8N', '9N', '+N'],
  ['4N', '5N', '6N'],
  ['1N', '2N', '3N', 'EnterN'],
  ['0N', '.N'],
];

const additionalLayout: (string | null)[][] = [
  ['FnE'],
  ['FnF'],
  ['FnG'],
  ['FnH'],
  ['FnI'],
  ['FnJ'],
];

const sideKeySpanMap: Record<string, number> = {
  Enter: 1,
  '0': 1.9,
};

const KeyboardContainer: React.FC<KeyboardContainerProps> = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', padding: '20px' }}>
      <KeyboardGridComponent
        keyLayout={mainKeyLayout}
        keySpanMap={mainKeySpanMap}
      />
      <KeyboardGridComponent
        keyLayout={navLayout}
        keySpanMap={sideKeySpanMap}
      />
      {/* <KeyboardGridNumComponent
        keyLayout={numpadLayout}
        keySpanMap={sideKeySpanMap}
      />
      <KeyboardGridComponent
        keyLayout={additionalLayout}
        keySpanMap={sideKeySpanMap}
      /> */}
    </Box>
  );
};

export default KeyboardContainer;
