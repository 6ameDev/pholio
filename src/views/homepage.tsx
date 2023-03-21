import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { isEqual } from 'lodash';

import SettingsMenu from './settings/menu';
import Platform from '../platforms/platform';
import { Params as APParams } from './settings/assets_panel';
import { PlatformsPanelProps } from './settings/platforms_panel';
import Transactions, { TransactionsProps } from './transactions';
import { GhostfolioPanelProps } from './settings/ghostfolio_panel';

export interface HomepageProps {
  currentPlatform: Platform;
  platformProps: {
    platforms: Platform[];
    onClick: (platform: Platform) => void;
  }
  transactionProps: TransactionsProps;
  assetsPanelParams: APParams;
  platformsPanelProps: PlatformsPanelProps;
  ghostfolioPanelProps: GhostfolioPanelProps;
}

export default function Homepage(props: HomepageProps) {
  const { currentPlatform, platformProps, transactionProps, assetsPanelParams, platformsPanelProps, ghostfolioPanelProps, ...others } = props;
  const { platforms, onClick: onPlatformClick } = platformProps;

  const [activePlatform, setActivePlatform] = useState(currentPlatform);

  useEffect(
    () => {
      if (typeof activePlatform !== typeof currentPlatform) {
        setActivePlatform(currentPlatform);
      }
    },
    [currentPlatform]
  );

  function findPlatformIndex(platforms: Platform[], currentPlatform: Platform): number | boolean {
    const index = platforms.findIndex((platform) => {
      return isEqual(platform, currentPlatform);
    })
    return (index > -1) ? index : false;
  }

  const handlePlatformClick = (platform: Platform) => {
    setActivePlatform(platform);
    onPlatformClick(platform);
  };

  const tabIndex = findPlatformIndex(platforms, currentPlatform);

  return (
    <Box>
      <AppBar elevation={0} position="static" color="inherit">
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Pholio
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <SettingsMenu
            assetsPanelParams={assetsPanelParams}
            platformsPanelProps={platformsPanelProps}
            ghostfolioPanelProps={ghostfolioPanelProps}
          />
        </Toolbar>
      </AppBar>

      <Typography variant="subtitle1" textAlign="center">PLATFORMS</Typography>

      <Box sx={{ display: 'flex', mb: 5 }}>
        <Box sx={{ flexGrow: 1 }}></Box>
        <Tabs value={tabIndex} variant="scrollable"
              scrollButtons allowScrollButtonsMobile>
          {platforms.map((platform) => {
            return (
              <Tab label={platform.name()} key={platform.name()} onClick={() => handlePlatformClick(platform)} />
            );
          })}
        </Tabs>
        <Box sx={{ flexGrow: 1 }}></Box>
      </Box>

      <Box sx={{ m: 3 }}>
        <Transactions props={transactionProps} />
      </Box>
    </Box>
  );
}
