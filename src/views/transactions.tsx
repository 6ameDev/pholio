import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Platform from '../platforms/platform';
import Utils from "../utils/view";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/system/Box';
import Badge from '@mui/material/Badge';
import ButtonGroup from '@mui/material/ButtonGroup';
import AssetConfigs from '../models/asset-configs';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[200]
  }
}));

export interface TransactionsProps {
  txns: any[];
  latestIndex: number;
  lastExported: any;
  platform: Platform;
  onReset: () => void;
  onExport: (txns: any[]) => void;
  onImported: (txn: any) => void;
  onSync: (txns: any[]) => void;
}

export default function Transactions({ props }: { props: TransactionsProps }) {
  const { txns, latestIndex, lastExported, platform, onReset, onExport, onImported, onSync } = props;

  const [configs, setConfigs] = useState<AssetConfigs>(null);

  const columns = ["Date", "Type", "Symbol", "Quantity", "Price", "Amount"];

  function handleImported() {
    onImported(txns[latestIndex]);
  }

  function resolveSymbol(symbol: string): string {
    return platform.resolveSymbol(symbol, configs);
  }

  useEffect(
    () => {
      AssetConfigs.fetch().then(
        (configs) => setConfigs(configs),
        (reason) => console.error(`Failed to setConfigs. Reason: %o`, reason)
      );
    },
    []);

  return (
    <Box>
      {lastExported && (
        <Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant='subtitle1'>LAST EXPORTED</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="text" onClick={onReset}>Reset</Button>
          </Box>
          <Paper elevation={1} sx={{ width: '100%', overflow: 'hidden', mt: 1 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableBody>
                <TableRow>
                  <StyledTableCell>{Utils.formatDate(lastExported.date)}</StyledTableCell>
                  <StyledTableCell>{lastExported.type}</StyledTableCell>
                  <StyledTableCell>{resolveSymbol(lastExported.symbol)}</StyledTableCell>
                  <StyledTableCell>{lastExported.quantity}</StyledTableCell>
                  <StyledTableCell>{Utils.formatCurrency(lastExported.unitPrice, lastExported.currency)}</StyledTableCell>
                  <StyledTableCell>{Utils.calcAmount(lastExported.quantity, lastExported.unitPrice, lastExported.currency)}</StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}

      {(txns && txns.length > 0) && (
        <Box sx={{ mt: 4 }}>
          <Badge color="primary" badgeContent={txns.length}>
            <Typography variant='subtitle1'>TRANSACTIONS</Typography>
          </Badge>
          <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <StyledTableCell key={column}>{column}</StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {txns.map((txn, index) => {
                    return (
                      <TableRow role="checkbox" tabIndex={-1} key={index}>
                        <TableCell>{Utils.formatDate(txn.date)}</TableCell>
                        <TableCell>{txn.type}</TableCell>
                        <TableCell>{resolveSymbol(txn.symbol)}</TableCell>
                        <TableCell>{txn.quantity}</TableCell>
                        <TableCell>{Utils.formatCurrency(txn.unitPrice, txn.currency)}</TableCell>
                        <TableCell>{Utils.calcAmount(txn.quantity, txn.unitPrice, txn.currency)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Box sx={{ display: 'flex', mt: 4 }}>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
              <Button onClick={() => onExport(txns)}>Export</Button>
              <Button onClick={handleImported}>Mark Imported</Button>
            </ButtonGroup>
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="contained" disableElevation onClick={() => onSync(txns)} disabled>Sync</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
