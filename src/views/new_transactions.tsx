import React from "react";
import Utils from "../utils/view";

export function View({ txns, latestIdx }: { txns: Array<any>, latestIdx: number }) {

  function txnStyling(index): string {
    return latestIdx === index ? "uk-light uk-background-accent" : "";
  }

  return (
    <div className="kevin">
      <h3>New Transactions <sup className="uk-badge">{txns.length}</sup></h3>

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
            {txns.map((txn, index) => {
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
            <button id="id-download" className="uk-button uk-button-default" disabled={txns.length < 1}>Download</button>
            </div>
            <div className="uk-navbar-item">
            <button id="id-mark-imported" className="uk-button uk-light uk-button-accent" disabled={txns.length < 1}>Mark Imported</button>
            </div>
          </ul>
        </div>

        <div className="uk-navbar-right">
          <ul className="uk-navbar-nav">
            <div className="uk-navbar-item">
              <button id="id-export" className="uk-button uk-button-default" disabled>Sync</button>
            </div>
          </ul>
        </div>
      </nav>
    </div>
  );
}
