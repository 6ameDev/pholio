import * as React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { debounce } from '@mui/material/utils';
import GfClient from '../../external/ghostfolio/client';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

import { AssetConfig } from '../../models/interfaces/asset-config.interface'

export default function SymbolTextField({ gfClient }: { gfClient: GfClient }) {
  const [value, setValue] = React.useState<AssetConfig | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<readonly AssetConfig[]>([]);

  const fetch = React.useMemo(
    function () {
      const delayMs = 300;
      const queryFn = async (input: string, callback: (results?: readonly AssetConfig[]) => void) => {
        const assetSymbols = await gfClient.getAssetSymbols(input);
        callback(assetSymbols);
      };
      return debounce(queryFn, delayMs);
    },
    []
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch(inputValue, (results?: readonly AssetConfig[]) => {
      if (active) {
        let newOptions: readonly AssetConfig[] = [];

        if (value) newOptions = [value];
        if (results) newOptions = [...newOptions, ...results];

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      id="id-asset-symbol"
      sx={{ width: 300 }}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.symbol
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText="No Assets"
      onChange={(event: any, newValue: AssetConfig | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Search By Asset Name" fullWidth />
      )}
      renderOption={(props, option) => {
        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item sx={{ display: 'flex', width: 44 }}>
              </Grid>
              <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                <Box component="span">{option.name}</Box>
                <Typography variant="body2" color="text.secondary">{option.symbol}</Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}
