import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { Box, Typography } from '@mui/material';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/storeRenderer';
import IconSetupMenuC from './IconSetupMenuC';

type Props = {
  imageAlt?: string;
  gap?: number;
};

export default function IconPageSetupViewC({
  imageAlt = 'icon',
  gap = 1,
}: Props) {
  const nActiveConfigPageId: number = useSelector(
    (state: RootState) => state.iconStateSlice.nActiveConfigPageId
  );

  const oIconPage = useSelector(
    (state: RootState) => state.iconStateSlice.oIconPages[nActiveConfigPageId]
  );
  const oIcons = useSelector((state: RootState) => state.iconStateSlice.oIcons);
  const [bDialogOpen, setBDialogOpen] = React.useState<boolean>(false);
  const [nOpenDialogPos, setOpenDialogPos] = React.useState<number>(-1);

  const fHandleDialogClose = () => {
    setBDialogOpen(false);
  };

  const fHandleSelect = (index: number) => {
    if (oIcons[oIconPage.aIcons[index]]?.bIconIsBack) {
      return;
    }
    setOpenDialogPos(index);
    setBDialogOpen(true);
  };

  const items = oIconPage.aIcons.map((item) => {
    if (oIcons[item] && oIcons[item].sIconImagePath != '') {
      return 'icon://' + encodeURIComponent(oIcons[item].sIconImagePath);
    } else {
      return 'icon://default.bmp';
    }
  });
  const iconNames = oIconPage.aIcons.map((item) => oIcons[item]?.sIconName);

  const itemsInverted = [...items].reverse();
  const invertedIconNames = [...iconNames].reverse();

  return (
    <Box sx={{ width: '100%', maxWidth: 260, mx: 'auto' }}>
      <Grid container spacing={gap} alignItems="stretch">
        {itemsInverted.map((src, idx) => (
          <Grid size={4} key={8 - idx}>
            <Card sx={{ aspectRatio: '1 / 1', height: '100%', position: 'relative' }}>
              <CardActionArea
                sx={{ height: '100%' }}
                onClick={() => fHandleSelect(8 - idx)}
              >
                <CardMedia
                  component="img"
                  image={src}
                  alt={`${imageAlt}-${8 - idx}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {invertedIconNames[idx] && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      px: 0.5,
                      py: 0.25,
                      background: 'rgba(0,0,0,0.55)',
                    }}
                  >
                    <Typography
                      variant="caption"
                      noWrap
                      sx={{ color: 'common.white', display: 'block' }}
                    >
                      {invertedIconNames[idx]}
                    </Typography>
                  </Box>
                )}
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <IconSetupMenuC
        open={bDialogOpen}
        onClose={fHandleDialogClose}
        nItemPos={nOpenDialogPos}
      />
    </Box>
  );
}
