import React from "react";
import Utils from "../utils/view";

export function View({ txns }: { txns: Array<any> }) {
  return (
    <div className="uk-container kevin">
      <h3>{txns.length} New Transactions Found</h3>

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
            {txns.map((txn) => {
              return (
                <tr>
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

      <nav className="uk-margin" uk-navbar>
        <div className="uk-navbar-left">
          <ul className="uk-navbar-nav">
            <div className="uk-navbar-item">
              {txns.length > 0
                ? <button id="id-download" className="uk-button uk-button-default">Download</button>
                : <button id="id-download" className="uk-button uk-button-default" disabled>Download</button>
              }
            </div>
            <div className="uk-navbar-item">
              {txns.length > 0
                ? <button id="id-mark-imported" className="uk-button uk-button-default">Mark Imported</button>
                : <button id="id-mark-imported" className="uk-button uk-button-default" disabled>Mark Imported</button>
              }
            </div>
          </ul>
        </div>

        <div className="uk-navbar-right">
          <ul className="uk-navbar-nav">
            <div className="uk-navbar-item">
              {txns.length > 0
                ? <button id="id-export" className="uk-button uk-button-default">Export</button>
                : <button id="id-export" className="uk-button uk-button-default" disabled>Export</button>
              }
            </div>
          </ul>
        </div>
      </nav>
    </div>
  );
}
