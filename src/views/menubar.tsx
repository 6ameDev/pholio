import React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Menu from './settings/menu';
import { Params as APParams } from './settings/assets_panel';
import { GhostfolioPanelProps } from './settings/ghostfolio_panel';
import { PlatformsPanelProps } from './settings/platforms_panel';

export interface MenubarProps {
  assetsPanelParams: APParams;
  platformsPanelProps: PlatformsPanelProps;
  ghostfolioPanelProps: GhostfolioPanelProps;
}

export default function Menubar(props: MenubarProps) {
  const { assetsPanelParams, platformsPanelProps, ghostfolioPanelProps, ...others } = props;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar elevation={0} position="static" color="inherit">
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Pholio
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Menu
            assetsPanelParams={assetsPanelParams}
            platformsPanelProps={platformsPanelProps}
            ghostfolioPanelProps={ghostfolioPanelProps}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
