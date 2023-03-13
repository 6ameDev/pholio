import React, { useState, useEffect } from "react";
import Platform from "../platforms/platform";
import Utils from "../utils/view";

export function View({ platform, txn, onReset }: { platform: Platform, txn: any, onReset: () => void }) {

  var [lastTxn, setLastTxn] = useState(txn);

  useEffect(
    () => {
      if (lastTxn !== txn) {
        setLastTxn(txn);
      }
    },
    [txn]
  );

  function handleReset() {
    onReset();
    setLastTxn(null);
  }

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
            { lastTxn &&
              <tr>
                <td>{Utils.formatDate(lastTxn.date)}</td>
                <td>{lastTxn.type}</td>
                <td>{platform.resolveSymbol(lastTxn.symbol)}</td>
                <td>{lastTxn.quantity}</td>
                <td>{Utils.formatCurrency(lastTxn.unitPrice, lastTxn.currency)}</td>
                <td>{Utils.calcAmount(lastTxn.quantity, lastTxn.unitPrice, lastTxn.currency)}</td>
              </tr>
            }
          </tbody>
      </table>

      <nav className="uk-margin" uk-navbar="true">
        <div className="uk-navbar-right">
          <ul className="uk-navbar-nav">
            <div className="uk-navbar-item">
            <button id="id-last-txn-reset" className="uk-button uk-button-default" disabled={!lastTxn} onClick={handleReset}>Reset</button>
            </div>
          </ul>
        </div>
      </nav>
    </div>
  );
}
