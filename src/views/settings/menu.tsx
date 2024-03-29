import React from 'react';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import SettingsSharp from '@mui/icons-material/SettingsSharp';
import { TransitionProps } from '@mui/material/transitions';

import SettingsTab from './tab';
import { Params as APParams } from './assets_panel';
import { GhostfolioPanelProps } from './ghostfolio_panel';
import { PlatformsPanelProps } from './platforms_panel';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export interface MenuProps {
  assetsPanelParams: APParams;
  platformsPanelProps: PlatformsPanelProps;
  ghostfolioPanelProps: GhostfolioPanelProps;
}

export default function Menu(props: MenuProps) {
  const { assetsPanelParams, platformsPanelProps, ghostfolioPanelProps, ...others } = props;

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <IconButton size="large" color="inherit" onClick={handleOpen}>
        <Badge badgeContent={''} color="default"><SettingsSharp /></Badge>
      </IconButton>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar elevation={1} sx={{ position: 'relative' }} color="inherit">
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Settings
            </Typography>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <SettingsTab
          assetsPanelParams={assetsPanelParams}
          platformsPanelProps={platformsPanelProps}
          ghostfolioPanelProps={ghostfolioPanelProps}
        />
      </Dialog>
    </Box>
  );
}