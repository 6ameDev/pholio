import React, { useEffect, useState } from "react";

import { isEqual } from "lodash";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";

import Str from "../../utils/str";
import PlatformConfigs from "../../models/platform-configs";

export interface PlatformsPanelProps {
  platformConfigs: PlatformConfigs;
  onSave: (configs: PlatformConfigs) => void;
}

export default function PlatformsPanel(props: PlatformsPanelProps) {
  const { platformConfigs, onSave, ...others } = props;

  const [configs, setConfigs] = useState(platformConfigs.configs);

  useEffect(
    () => {
      if (!isEqual(configs, platformConfigs.configs)) {
        setConfigs(platformConfigs.configs);
      }
    },
    [platformConfigs.configs]
  );

  function onAccountIdChange(name: string, event) {
    const newAccountId = event.target.value;
    setConfigs(configs.map(config => {
      if (config.name === name) {
        return { ...config, id: newAccountId };
      }
      return config;
    }));
  }

  function handleSave() {
    const platformConfigs = new PlatformConfigs(configs);
    onSave(platformConfigs);
  }

  return (
    <FormControl component="fieldset">
      <FormGroup aria-label="position" row>
        <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h6">Ghostfolio Platforms</Typography>
          </Grid>
          {configs.map((config) => {
            const label = `Account Id for ${config.name}`;
            const domId = `id-${ Str.hyphenate(config.name).toLowerCase() }-account-id`;

            return (
              <Grid item xs={12} key={domId}>
                <TextField fullWidth label={label} value={config.id} onChange={(e) => onAccountIdChange(config.name, e)} />
              </Grid>
            );
          })}
          <Grid item xs={12}>
            <Grid container direction="row" justifyContent="flex-end" alignItems="center" spacing={3}>
              <Grid item>
                <Button variant="contained" onClick={handleSave}>Save</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </FormGroup>
    </FormControl>
  );
}