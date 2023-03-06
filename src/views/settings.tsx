import React, { useState } from "react";
import Settings from "../storage/settings";

export function View({ init, onSave }: { init: Settings, onSave: (settings: Settings) => void }) {

  const GF_HOST_PLACEHOLDER = "Example: http://192.168.0.10:3333";

  const [gfHost, setGfHost] = useState(init.ghostfolioHost);
  const [accounts, setAccounts] = useState(init.accounts);

  function onGfHostChange(e) {
    setGfHost(e.target.value);
  }

  function onAccountIdChange(accountName: string, newAccountId: string) {
    setAccounts(accounts.map(account => {
      if (account.name === accountName) {
        return {
          ...account,
          id: newAccountId,
        };
      } else {
        return account;
      }
    }));
  }

  const settings = new Settings(gfHost, accounts)

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button className="uk-modal-close-default" type="button" uk-close="true"></button>

      <h4>Pholio Settings</h4>
      <form className="uk-form-horizontal uk-margin-large">
        <div className="uk-margin uk-inline inline-unblock">
          <label className="uk-form-label" htmlFor="id-gf-host">Ghostfolio Host</label>
          <div className="uk-form-controls">
            <a className="uk-form-icon uk-form-icon-flip" href="#" uk-icon="icon: refresh"></a>
            <input className="uk-input uk-form-blank" id="id-gf-host" type="text"
                      placeholder={GF_HOST_PLACEHOLDER} value={gfHost} onChange={onGfHostChange} />
          </div>
        </div>
        <hr />
        {accounts.map((account) => {
          const domId = `id-${account.name.toLowerCase()}-account-setting`;
          const placeholder = `Your ${account.name} Account Id on Ghostfolio`;

          return (
            <div className="uk-margin" key={domId}>
              <label className="uk-form-label" htmlFor={domId}>{account.name} Account Id</label>
              <div className="uk-form-controls">
                  <input className="uk-input uk-form-blank" type="text" id={domId} placeholder={placeholder}
                          value={account.id} onChange={ e => onAccountIdChange(account.name, e.target.value) } />
              </div>
            </div>
          );
        })}
      </form>
      <p className="uk-text-right">
          <button className="uk-button uk-button-default uk-modal-close uk-margin-right" type="button">Cancel</button>
          <button className="uk-button uk-button-primary uk-modal-close" type="button" onClick={() => {onSave(settings)}}>Save</button>
      </p>
    </div>
  );
}
