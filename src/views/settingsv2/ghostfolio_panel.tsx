import React from "react";
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

export default function GhostfolioPanel() {

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <FormControl component="fieldset">
      <FormGroup aria-label="position" row>
        <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h6">Ghostfolio</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Host" id="id-gf-host"
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
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
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
                <Button variant="contained" endIcon={<Save />}>Save</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </FormGroup>
    </FormControl>
  );
}