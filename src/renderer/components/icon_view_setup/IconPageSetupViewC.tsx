import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { Box, CardContent, Typography } from '@mui/material';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/storeRenderer';
import IconSetupMenuC from './IconSetupMenuC';

type Props = {
  imageAlt?: string;
  gap?: number;
};

/**
 * IconScreenComponent
 * Renders a 3x3 grid of images using Material-UI components.
 *
 * Usage:
 * <IconScreenComponent images={[...9 urls...]} onSelect={(i)=>console.log(i)} />
 */
export default function IconPageSetupViewC({
  imageAlt = 'icon',
  gap = 2,
}: Props) {
  // Ensure there are exactly 9 items to render
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
    console.log('fHandleSelect ' + index);
    if (oIcons[oIconPage.aIcons[index]]?.bIconIsBack) {
      return;
    }
    setOpenDialogPos(index);
    setBDialogOpen(true);
  };
  console.log('setup page object');
  console.log(oIconPage);
  const items = oIconPage.aIcons.map((item, index) => {
    if (oIcons[item] && oIcons[item].sIconImagePath != '') {
      return 'icon://' + encodeURIComponent(oIcons[item].sIconImagePath);
    } else {
      return 'icon://default.bmp';
    }
  });
  const iconNames = oIconPage.aIcons.map((item, index) => {
    return oIcons[item]?.sIconName;
  });
  console.log(items);

  /* invert items array*/
  const itemsInverted = items.reverse();
  const invertedIconNames = iconNames.reverse();
  return (
    <Box width={250}>
      <Typography>Page configuration</Typography>
      <Grid container spacing={gap} sx={{alignItems: "stretch"}} >
        {itemsInverted.map((src, idx) => (
          <Grid size={4} key={8-idx} >
            <Card sx={{ height: '100%' }}>
              <CardActionArea onClick={() => fHandleSelect(8-idx)}>
                <CardMedia
                  component="img"
                  image={src}
                  alt={`${imageAlt}-${8-idx}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    rotate: '180deg',
                  }}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {invertedIconNames[idx]}
                  </Typography>
                </CardContent>
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
