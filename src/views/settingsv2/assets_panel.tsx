import React, { useEffect, useState } from "react";

import Save from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AssetConfigs from "../../models/asset-configs";
import { isEqual } from "lodash";
import Str from "../../utils/str";
import SymbolTextField from "../components/symbol-textfield";
import GfClient from "../../external/ghostfolio/client";

type OnSaveCb = (configs: AssetConfigs) => void;
export type Params = { assetConfigs: AssetConfigs, gfClient: GfClient, onSave: OnSaveCb };

export function AssetsPanel({ assetConfigs, gfClient, onSave }: Params) {

  const [configs, setConfigs] = useState(assetConfigs.configs);

  useEffect(
    () => {
      if (!isEqual(configs, assetConfigs.configs)) {
        setConfigs(assetConfigs.configs);
      }
    },
    [assetConfigs.configs]
  );

  function onSymbolChange(name: string, newSymbol: string) {
    setConfigs(configs.map(config => {
      if (config.name === name) {
        return { ...config, symbol: newSymbol };
      }
      return config;
    }));
  }

  function handleSave() {
    const assetConfigs = new AssetConfigs(configs);
    onSave(assetConfigs);
  }
  
  return (
    <FormControl component="fieldset">
      <FormGroup aria-label="position" row>
        <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h6">Asset Configs</Typography>
          </Grid>
          {configs.map((config) => {
            const label = `Symbol for ${config.name}`;
            const domId = `id-symbol-${ Str.hyphenate(config.name).toLowerCase() }`;

            return (
              <Grid item xs={12} key={domId}>
                <SymbolTextField gfClient={gfClient} initValue={config} label={label} onChange={(symbol) => onSymbolChange(config.name, symbol)} />
              </Grid>
            );
          })}
          <Grid item xs={12}>
            <Grid container direction="row" justifyContent="flex-end" alignItems="center" spacing={3}>
              <Grid item>
                <Button variant="contained" endIcon={<Save />} onClick={handleSave}>
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </FormGroup>
    </FormControl>
  );
}