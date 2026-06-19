import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { Box } from '@mui/material';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/storeRenderer';

type Props = {
  imageAlt?: string;
  gap?: number;
};

export default function IconActiveScreenC({
  imageAlt = 'icon',
  gap = 1,
}: Props) {
  const nActivePageId: number = useSelector(
    (state: RootState) => state.iconStateSlice.nActivePageId
  );

  const oIconPage = useSelector(
    (state: RootState) => state.iconStateSlice.oIconPages[nActivePageId]
  );
  const oIcons = useSelector((state: RootState) => state.iconStateSlice.oIcons);

  const items = oIconPage.aIcons.map((item) => {
    if (oIcons[item] && oIcons[item].sIconImagePath != '') {
      return 'icon://' + encodeURIComponent(oIcons[item].sIconImagePath);
    } else {
      return 'icon://default.bmp';
    }
  });

  const itemsInverted = [...items].reverse();

  return (
    <Box sx={{ width: '100%', maxWidth: 260, mx: 'auto' }}>
      <Grid container spacing={gap}>
        {itemsInverted.map((src, idx) => (
          <Grid size={4} key={idx}>
            <Card sx={{ aspectRatio: '1 / 1', height: '100%' }}>
              <CardActionArea sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  image={src}
                  alt={`${imageAlt}-${idx}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    rotate: '180deg',
                  }}
                />
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
