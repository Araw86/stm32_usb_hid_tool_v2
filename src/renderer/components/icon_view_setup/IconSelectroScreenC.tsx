import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';

type Props = {
  images: string[]; // array of image names or paths
  open: boolean; // initial open state (default true)
  basePath?: string; // optional base path to prepend to image names (default "/assets/icons/")
  onClose?: () => void; // optional callback when dialog is closed
  onSelect?: (image: string) => void; // optional callback when an image is selected (in addition to dispatch)
};

const IconSelectroScreenC: React.FC<Props> = ({
  images,
  open: openProp = false,
  basePath = 'icon://',
  onClose,
  onSelect,
}) => {
  // const dispatch = useDispatch();
  console.log('openProp ' + openProp);
  const handleClose = () => {
    console.log('inc close');

    onClose?.();
  };

  console.log('IconSelectroScreenC');
  console.log('Open state' + openProp);
  const handleSelect = (imgName: string) => {
    console.log('handleSelect ' + imgName);
    onSelect?.(imgName);
    onClose?.();
  };

  const handleAddIcon = async () => {
    const api = (window as any).ipc_handlers;
    if (!api?.iconAdd) {
      console.error('iconAdd IPC not available');
      return;
    }
    try {
      const result = await api.iconAdd();
      if (!result?.ok && result?.reason === 'error') {
        console.error('iconAdd failed:', result.message);
      }
    } catch (err) {
      console.error('iconAdd threw', err);
    }
  };

  return (
    <Dialog open={openProp} onClose={handleClose}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flex: 1 }}>
            Select Icon
          </Typography>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={handleAddIcon}
            sx={{ mr: 1 }}
          >
            Add icon
          </Button>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        {images.length === 0 ? (
          <Typography>No images provided</Typography>
        ) : (
          <ImageList variant="masonry" cols={4} gap={12}>
            {images.map((name) => {
              const src =
                name.startsWith('http') || name.startsWith('/')
                  ? name
                  : `${basePath}${encodeURIComponent(name)}`;
              return (
                <ImageListItem key={name} sx={{ cursor: 'pointer' }}>
                  <img
                    src={src}
                    alt={name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 8,
                      display: 'block',
                    }}
                    onClick={() => handleSelect(name)}
                  />
                  <Box
                    sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleSelect(name)}
                    >
                      Select
                    </Button>
                  </Box>
                </ImageListItem>
              );
            })}
          </ImageList>
        )}
      </Box>
    </Dialog>
  );
};

export default IconSelectroScreenC;
