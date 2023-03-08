import React, { useState, useEffect } from "react";
import Utils from "../utils/view";

type cbWithTxns = (txns: Array<any>) => void;
type cbWithTxn = (txn: any) => void;

export function View({ txns, latestIdx, onExport, onImported, onSync }:
  { txns: Array<any>, latestIdx: number, onExport: cbWithTxns, onImported: cbWithTxn, onSync: cbWithTxns }) {

  const [newTxns, setNewTxns] = useState(txns);
  const [latestIndex, setLatestIndex] = useState(latestIdx);

  useEffect(
    () => {
      if (newTxns !== txns || latestIndex !== latestIdx) {
        setNewTxns(txns);
        setLatestIndex(latestIdx);
      }
    },
    [txns, latestIdx]
  );

  function handleImported() {
    onImported(newTxns[latestIndex]);
    setNewTxns([]);
    setLatestIndex(-1);
  }

  function txnStyling(index): string {
    return latestIndex === index ? "uk-light uk-background-accent" : "";
  }

  return (
    <div className="kevin">
      <h3>New Transactions <sup className="uk-badge">{newTxns.length}</sup></h3>

      <div className="uk-overflow-auto height-fit">
        <table className="uk-table uk-table-small uk-table-divider">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {newTxns.map((txn, index) => {
              return (
                <tr key={index} className={txnStyling(index)}>
                  <td>{Utils.formatDate(txn.date)}</td>
                  <td>{txn.type}</td>
                  <td>{txn.symbol}</td>
                  <td>{txn.quantity}</td>
                  <td>{Utils.formatCurrency(txn.unitPrice, txn.currency)}</td>
                  <td>{Utils.calcAmount(txn.quantity, txn.unitPrice, txn.currency)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <nav className="uk-margin" uk-navbar="true">
        <div className="uk-navbar-left">
          <ul className="uk-navbar-nav">
            <div className="uk-navbar-item">
              <button className="uk-button uk-button-default" disabled={newTxns.length < 1} onClick={() => onExport(newTxns)}>Export</button>
            </div>
            <div className="uk-navbar-item">
              <button id="id-mark-imported" className="uk-button uk-light uk-button-accent"
                      disabled={newTxns.length < 1} onClick={handleImported}>Mark Imported</button>
            </div>
          </ul>
        </div>

        <div className="uk-navbar-right">
          <ul className="uk-navbar-nav">
            <div className="uk-navbar-item">
              <div className="uk-inline">
                <button id="id-sync" className="uk-button uk-button-default" onClick={() => onSync(newTxns)} disabled>Sync</button>
                <div className="uk-card uk-card-body uk-card-default" uk-drop="pos: bottom-center; delay-show: 1000; delay-hide: 200">
                  Sync directly transfers new transactions to Ghostfolio. Removes the need to export them and import to Ghostfolio manually.
                </div>
              </div>
            </div>
          </ul>
        </div>
      </nav>
    </div>
  );
}
