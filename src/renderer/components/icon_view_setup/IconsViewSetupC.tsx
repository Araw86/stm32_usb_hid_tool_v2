import React from 'react';
import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import IconPagesViewC from './IconPagesViewC';
import IconActiveScreenC from './IconActiveScreenC';
import IconPageSetupViewC from './IconPageSetupViewC';

type Props = {};

type PanelProps = {
  title: string;
  children: React.ReactNode;
};

const Panel: React.FC<PanelProps> = ({ title, children }) => (
  <Paper
    variant="outlined"
    sx={{
      height: '100%',
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: 1.5,
      borderColor: 'divider',
      backgroundColor: 'background.paper',
    }}
  >
    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    <Divider />
    <Box sx={{ flexGrow: 1, minHeight: 0 }}>{children}</Box>
  </Paper>
);

const IconsViewSetupC = (props: Props) => {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="stretch">
        <Grid size={4}>
          <Panel title="Icon Pages tree view">
            <IconPagesViewC />
          </Panel>
        </Grid>
        <Grid size={4}>
          <Panel title="Page configuration">
            <IconPageSetupViewC />
          </Panel>
        </Grid>
        <Grid size={4}>
          <Panel title="Active keyboard display view">
            <IconActiveScreenC />
          </Panel>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IconsViewSetupC;
