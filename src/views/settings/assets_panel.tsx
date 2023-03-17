import React from "react";
import Save from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function AssetsPanel() {
  return (
    <FormControl component="fieldset">
      <FormGroup aria-label="position" row>
        <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h6">Asset Configs</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth id="id-symbol-hdfc-nifty-50" label="Symbol: HDFC Nifty 50 Growth Direct Fund"/>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth id="id-symbol-icici-gilt" label="Symbol: ICICI Gilt Growth Direct Fund"/>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth id="id-symbol-uti-nifty-next-50" label="Symbol: UTI Nifty Next 50 Growth Direct Fund"/>
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