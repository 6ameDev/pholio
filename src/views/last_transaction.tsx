import React from "react";
import Utils from "../utils/view";

export function View({ txn, onReset }: { txn: any, onReset: () => void }) {
  return (
    <div className="uk-overflow-auto">
      <h3>Last Exported</h3>
      <table className="uk-table">
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
            { txn &&
              <tr>
                <td>{Utils.formatDate(txn.date)}</td>
                <td>{txn.type}</td>
                <td>{txn.symbol}</td>
                <td>{txn.quantity}</td>
                <td>{Utils.formatCurrency(txn.unitPrice, txn.currency)}</td>
                <td>{Utils.calcAmount(txn.quantity, txn.unitPrice, txn.currency)}</td>
              </tr>
            }
          </tbody>
      </table>

      <nav className="uk-margin" uk-navbar="true">
        <div className="uk-navbar-right">
          <ul className="uk-navbar-nav">
            <div className="uk-navbar-item">
            <button id="id-last-txn-reset" className="uk-button uk-button-default" disabled={!txn} onClick={onReset}>Reset</button>
            </div>
          </ul>
        </div>
      </nav>
    </div>
  );
}
