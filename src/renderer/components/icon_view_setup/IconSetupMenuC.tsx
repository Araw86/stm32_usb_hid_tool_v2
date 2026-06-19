import { Box, Button, Dialog, Stack, Tab, TextField } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import React from 'react';

import { useSelector } from 'react-redux';
import { RootState, store } from '../../store/storeRenderer';
import IconSelectroScreenC from './IconSelectroScreenC';
import {
  addIcon,
  removeIcon,
} from './../../../shared/redux/slices/iconStateSlice';

type Props = {
  open: boolean; // initial open state (default true)
  onClose: () => void; // optional callback when dialog is closed
  nItemPos: number;
};

const IconSetupMenuC = (props: Props) => {
  const { open, nItemPos } = props;
  const [value, setValue] = React.useState(1);
  const [sImageName, setSImageName] = React.useState<string>('');
  const IMAGE_BASE_PATH = 'icon://';
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const aIcons: string[] = useSelector(
    (state: RootState) => state.iconStateSlice.allIcons
  );
  const handleClose = () => {
    props.onClose?.();
  };

  const [bImageSelect, setBImageSelect] = React.useState<boolean>(false);
  const fImageSlectClose = () => {
    setBImageSelect(false);
  };
  const fImageSelect = (sImageName: string) => {
    setSImageName(sImageName);
    setBImageSelect(false);
  };
  const [sProgramPath, setSProgramPath] = React.useState<string>('notepad');
  const [sPageName, setSPageName] = React.useState<string>('');

  const nActiveConfigPageId: number = useSelector(
    (state: RootState) => state.iconStateSlice.nActiveConfigPageId
  );
  const oIconPages = useSelector(
    (state: RootState) => state.iconStateSlice.oIconPages
  );
  const oIcons = useSelector((state: RootState) => state.iconStateSlice.oIcons);

  const fHandleDelete = () => {
    store.dispatch(removeIcon(nItemPos));
    props.onClose?.();
  };

  const fHandleAddIcon = () => {
    store.dispatch(
      addIcon({
        sIconPosition: nItemPos,
        sIconName: sPageName,
        sIconImagePath: sImageName,
        bLinkedPage: false,
        sIconProgramPath: sProgramPath,
      })
    );
    props.onClose?.();
  };

  const fHandleAddPage = () => {
    store.dispatch(
      addIcon({
        sIconPosition: nItemPos,
        sIconName: sPageName,
        sIconImagePath: sImageName,
        bLinkedPage: true,
        sIconProgramPath: '',
      })
    );
    props.onClose?.();
  };

  /* check if component exists*/
  const oIconPage = oIconPages[nActiveConfigPageId];
  let bIconExists = false;
  if (oIconPage.aIcons[nItemPos] == 0) {
    /* icond not exists*/
  } else {
    /*icon exists*/
    bIconExists = true;
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="sm">
      {bIconExists ? (
        <Box p={2}>
          <Button variant="contained" component="label" onClick={fHandleDelete}>
            Delete
          </Button>
        </Box>
      ) : (
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label="Tabs where each tab needs to be selected manually"
          >
            <Tab label="Start program" value={1} />
            <Tab label="Subfolder" value={2} />
          </TabList>
          <TabPanel value={1}>
            <Box mb={2}>
              <TextField
                id="outlined-basic"
                label="Icon name"
                variant="outlined"
                value={sPageName}
                onChange={(e) => setSPageName(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <Button
                variant="contained"
                component="label"
                onClick={() => setBImageSelect(true)}
              >
                Select Icon
              </Button>
              {sImageName != '' && (
                <img
                  src={IMAGE_BASE_PATH + encodeURIComponent(sImageName)}
                  alt={sImageName}
                  loading="lazy"
                  style={{
                    width: '50px',
                    height: 'auto',
                    borderRadius: 8,
                    display: 'block',
                    rotate: '180deg',
                  }}
                />
              )}
            </Box>
            <Box mb={2}>
              <TextField
                id="outlined-basic"
                label="Program"
                variant="outlined"
                value={sProgramPath}
                onChange={(e) => setSProgramPath(e.target.value)}
              />
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                component="label"
                onClick={fHandleAddIcon}
              >
                Set program
              </Button>
            </Stack>
          </TabPanel>
          <TabPanel value={2}>
            <Box mb={2}>
              <Button
                variant="contained"
                component="label"
                onClick={() => setBImageSelect(true)}
              >
                Select Icon
              </Button>
              {sImageName != '' && (
                <img
                  src={IMAGE_BASE_PATH + encodeURIComponent(sImageName)}
                  alt={sImageName}
                  loading="lazy"
                  style={{
                    width: '50px',
                    height: 'auto',
                    borderRadius: 8,
                    display: 'block',
                    rotate: '180deg',
                  }}
                />
              )}
            </Box>
            <Box mb={2}>
              <TextField
                id="outlined-basic"
                label="Folder name"
                variant="outlined"
                value={sPageName}
                onChange={(e) => setSPageName(e.target.value)}
              />
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                component="label"
                onClick={fHandleAddPage}
              >
                Set subfolder
              </Button>
            </Stack>
          </TabPanel>
        </TabContext>
      )}
      <IconSelectroScreenC
        images={aIcons}
        open={bImageSelect}
        onClose={fImageSlectClose}
        onSelect={fImageSelect}
      />
    </Dialog>
  );
};

export default IconSetupMenuC;
