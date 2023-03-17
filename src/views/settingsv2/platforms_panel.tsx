import React from "react";

import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Save from "@mui/icons-material/Save";

export default function PlatformsPanel() {
  return (
    <FormControl component="fieldset">
      <FormGroup aria-label="position" row>
        <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h6">Ghostfolio Platforms</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth id="id-kuvera-account-id" label="Kuvera Account Id on Ghostfolio"/>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth id="id-vested-account-id" label="Vested Account Id on Ghostfolio"/>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth id="id-zerodha-account-id" label="Zerodha Account Id on Ghostfolio"/>
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row" justifyContent="flex-end" alignItems="center" spacing={3}>
              <Grid item>
                <Button variant="contained" endIcon={<Save />}>Save</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </FormGroup>
    </FormControl>
  );
}