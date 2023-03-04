import React from "react";
import Utils from "../utils/view";

export function View({ txn }: { txn: any }) {
  return (
    <div className="uk-container">
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
    </div>
  );
}
