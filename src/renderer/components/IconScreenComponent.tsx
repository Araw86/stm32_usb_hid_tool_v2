import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { Box, Typography } from '@mui/material';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import { useSelector } from 'react-redux';
import { RootState } from '../store/storeRenderer';
import IconSelectroScreenC from './icon_view_setup/IconSelectroScreenC';

type Props = {
  imageAlt?: string;
  gap?: number;
};

const DEFAULT_PLACEHOLDERS = Array.from({ length: 9 }).map(
  (_, i) => `https://via.placeholder.com/300?text=${i + 1}`
);

/**
 * IconScreenComponent
 * Renders a 3x3 grid of images using Material-UI components.
 *
 * Usage:
 * <IconScreenComponent images={[...9 urls...]} onSelect={(i)=>console.log(i)} />
 */
export default function IconScreenComponent({
  imageAlt = 'icon',
  gap = 2,
}: Props) {
  // Ensure there are exactly 9 items to render
  let items = [];
  const aImages: string[] = useSelector(
    (state: RootState) => state.iconStateSlice.activeIcons
  );
  const aAllImages: string[] = useSelector(
    (state: RootState) => state.iconStateSlice.allIcons
  );

  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDialogId, setOpenDialogId] = React.useState<number>(-1);
  console.log('image array');
  console.log(aImages);
  while (items.length < 9) {
    items.push(DEFAULT_PLACEHOLDERS[items.length]);
  }
  items = items.map((item, index) => {
    if (aImages[index] != '') {
      return 'icon://' + encodeURIComponent(aImages[index]);
    } else {
      return item;
    }
  });
  console.log(items);
  const fOnClick = (index: number) => {
    console.log('on click');
    setOpenDialogId(index);
    setOpenDialog(true);
  };

  const fOnClose = () => {
    console.log('on close');
    setOpenDialog(false);
  };

  return (
    <Box width={200}>
      <Typography>Icon selection</Typography>
      <Grid container spacing={gap}>
        {items.map((src, idx) => (
          <Grid size={4} key={idx}>
            <Card>
              <CardActionArea onClick={() => fOnClick(idx)}>
                <CardMedia
                  component="img"
                  image={src}
                  alt={`${imageAlt}-${idx}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    // paddingBottom: '100%', // keep square aspect ratio
                    objectFit: 'cover',
                  }}
                />
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* <IconSelectroScreenC
        images={aAllImages}
        open={openDialog}
        onClose={() => fOnClose()}
        index={openDialogId}
      /> */}
    </Box>
  );
}
