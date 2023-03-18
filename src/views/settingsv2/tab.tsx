import * as React from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import TabPanel from './tab_panel';
import { AssetsPanel, Params as APParams } from './assets_panel';
import { GhostfolioPanel, GhostfolioPanelProps } from './ghostfolio_panel';
import PlatformsPanel, { PlatformsPanelProps } from './platforms_panel';

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`
  };
}

interface Props {
  assetsPanelParams: APParams;
  platformsPanelProps: PlatformsPanelProps;
  ghostfolioPanelProps: GhostfolioPanelProps;
}

export default function SettingsTab(props: Props) {
  const { assetsPanelParams, platformsPanelProps, ghostfolioPanelProps, ...others } = props;

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}>
      <Tabs orientation="vertical" value={value} onChange={handleChange} aria-label="Settings Tabs"
            sx={{ borderRight: 1, borderColor: 'divider', overflow: 'visible' }}>
        <Tab label="Platforms" sx={{ alignItems: 'start'}} {...a11yProps(0)} />
        <Tab label="Ghostfolio" sx={{ alignItems: 'start'}} {...a11yProps(1)} />
        <Tab label="Assets" sx={{ alignItems: 'start'}} {...a11yProps(2)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <PlatformsPanel platformConfigs={platformsPanelProps.platformConfigs} onSave={platformsPanelProps.onSave}></PlatformsPanel>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GhostfolioPanel config={ghostfolioPanelProps.config} onSave={ghostfolioPanelProps.onSave} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AssetsPanel
          assetConfigs={assetsPanelParams.assetConfigs}
          gfClient={assetsPanelParams.gfClient}
          onSave={assetsPanelParams.onSave} />
      </TabPanel>
    </Box>
  );
}