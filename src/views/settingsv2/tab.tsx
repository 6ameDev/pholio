import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from './tab_panel';
import GhostfolioPanel from './ghostfolio_panel';
import PlatformsPanel from './platforms_panel';
import AssetsPanel from './assets_panel';

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`
  };
}

export default function SettingsTab() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}>
      <Tabs orientation="vertical" value={value} onChange={handleChange}
            aria-label="Settings Tabs" sx={{ borderRight: 1, borderColor: 'divider' }}>
        <Tab label="Platforms" sx={{ alignItems: 'start'}} {...a11yProps(0)} />
        <Tab label="Ghostfolio" sx={{ alignItems: 'start'}} {...a11yProps(1)} />
        <Tab label="Assets" sx={{ alignItems: 'start'}} {...a11yProps(2)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <PlatformsPanel></PlatformsPanel>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GhostfolioPanel></GhostfolioPanel>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AssetsPanel></AssetsPanel>
      </TabPanel>
    </Box>
  );
}