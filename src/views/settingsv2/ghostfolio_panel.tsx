import React, { useState } from "react";

import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import Save from "@mui/icons-material/Save";
import { GhostfolioConfig } from "../../models/interfaces/ghostfolio-config.interface";

export interface GhostfolioPanelProps {
  config: GhostfolioConfig;
  onSave: (config: GhostfolioConfig) => void;
}

export function GhostfolioPanel(props: GhostfolioPanelProps) {
  const { config, onSave, ...other } = props;

  const [host, setHost] = useState(config.host);
  const [token, setToken] = useState(config.securityToken);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => setShowPassword((show) => !show);

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  function handleHostChange(e) {
    setHost(e.target.value);
  }

  function handleTokenChange(e) {
    setToken(e.target.value);
  }

  function handleSave() {
    const config = { host, securityToken: token };
    onSave(config);
  }

  return (
    <FormControl component="fieldset">
      <FormGroup aria-label="position" row>
        <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h6">Ghostfolio</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Host" id="id-gf-host" value={host} onChange={handleHostChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">http://</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="id-gf-security-token">Security Token</InputLabel>
              <OutlinedInput
                id="id-gf-security-token"
                value={token}
                onChange={handleTokenChange}
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} onMouseDown={handleMouseDown} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Security Token"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row" justifyContent="flex-end" alignItems="center" spacing={3}>
              <Grid item>
                <Button variant="outlined" disabled>Test</Button>
              </Grid>
              <Grid item>
                <Button variant="contained" endIcon={<Save />} onClick={handleSave}>Save</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </FormGroup>
    </FormControl>
  );
}