import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Platform from '../models/platforms/platform';
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

  type Column = {
    name: string;
    align: "left" | "right";
  };

  const columns: Column[] = [
    { name: "Date", align: "left" },
    { name: "Type", align: "left" },
    { name: "Symbol", align: "left" },
    { name: "Quantity", align: "right" },
    { name: "Price", align: "right" },
    { name: "Amount", align: "right" }
  ];

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
      {lastExported && (() => {
        const locale = platform.locale;
        const { date, type, symbol, quantity, unitPrice, currency } = lastExported;
        return (
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
                    <StyledTableCell>{Utils.formatDate(date)}</StyledTableCell>
                    <StyledTableCell>{type}</StyledTableCell>
                    <StyledTableCell>{resolveSymbol(symbol)}</StyledTableCell>
                    <StyledTableCell align="right">{quantity}</StyledTableCell>
                    <StyledTableCell align="right">{Utils.formatCurrency(unitPrice, currency, locale)}</StyledTableCell>
                    <StyledTableCell align="right">{Utils.calcAmount(quantity, unitPrice, currency, locale)}</StyledTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
        </Box>
        )})()
      }

      {(txns && txns.length > 0) && (
        <Box sx={{ mt: 5 }}>
          <Badge color="primary" badgeContent={txns.length}>
            <Typography variant='subtitle1'>TRANSACTIONS</Typography>
          </Badge>
          <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => {
                      const { name, align } = column;
                      return (
                        <StyledTableCell align={align} key={name}>{name}</StyledTableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {txns.map((txn, index) => {
                    const locale = platform.locale;
                    const { date, type, symbol, quantity, unitPrice, currency } = txn;
                    return (
                      <TableRow role="checkbox" tabIndex={-1} key={index}>
                        <TableCell>{Utils.formatDate(date)}</TableCell>
                        <TableCell>{type}</TableCell>
                        <TableCell>{resolveSymbol(symbol)}</TableCell>
                        <TableCell align="right">{quantity}</TableCell>
                        <TableCell align="right">{Utils.formatCurrency(unitPrice, currency, locale)}</TableCell>
                        <TableCell align="right">{Utils.calcAmount(quantity, unitPrice, currency, locale)}</TableCell>
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
