import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { debounce } from '@mui/material/utils';
import GfClient from '../ghostfolio/client';

interface LookupItem {
  name: string;
  symbol: string;
}

export default function View({ gfClient }: { gfClient: GfClient }) {
  const [value, setValue] = React.useState<LookupItem | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<readonly LookupItem[]>([]);

  const fetch = React.useMemo(
    function () {
      const delayMs = 300;
      const queryFn = async (input: string, callback: (results?: readonly LookupItem[]) => void) => {
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

    fetch(inputValue, (results?: readonly LookupItem[]) => {
      if (active) {
        let newOptions: readonly LookupItem[] = [];

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
      onChange={(event: any, newValue: LookupItem | null) => {
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
