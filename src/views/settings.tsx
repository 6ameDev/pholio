import React, { useState } from "react";
import Settings from "../models/settings";

export function View({ init, onSave }: { init: Settings, onSave: (settings: Settings) => void }) {

  const HOST_PLACEHOLDER = "Example: http://192.168.0.10:3333";

  const [host, setHost] = useState(init.ghostfolio.host);
  const [securityToken, setSecurityToken] = useState(init.ghostfolio.securityToken);
  const [accounts, setAccounts] = useState(init.accounts);
  const [tokenHidden, setTokenHidden] = useState(true);

  function onHostChange(e) {
    setHost(e.target.value);
  }

  function onTokenChange(e) {
    setSecurityToken(e.target.value);
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

  function toggleTokenVisibility() {
    setTokenHidden(!tokenHidden);
  }

  const settings = new Settings({ host, securityToken }, accounts);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button className="uk-modal-close-default" type="button" uk-close="true"></button>

      <h4>Pholio Settings</h4>
      <form className="uk-form-horizontal uk-margin-large">
        <h5>Ghostfolio</h5>
        <div className="uk-margin uk-inline inline-unblock">
          <label className="uk-form-label" htmlFor="id-gf-host">Host</label>
          <div className="uk-form-controls">
            <a className="uk-form-icon uk-form-icon-flip" href="#" uk-icon="icon: refresh"></a>
            <input className="uk-input uk-form-blank" id="id-gf-host" type="text"
                    placeholder={HOST_PLACEHOLDER} value={host} onChange={onHostChange} />
          </div>
        </div>
        <div className="uk-margin uk-inline inline-unblock">
          <label className="uk-form-label" htmlFor="id-gf-host">Security Token</label>
          <div className="uk-form-controls">
            <a className="uk-form-icon uk-form-icon-flip" href="#" onClick={toggleTokenVisibility}
                uk-icon={`icon: ${tokenHidden? 'eye' : 'eye-slash'}`}></a>
            <input className="uk-input uk-form-blank" id="id-gf-host" type={tokenHidden ? "password" : "text"}
                    value={securityToken} onChange={onTokenChange} />
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

      <div className="uk-grid-collapse uk-flex-middle uk-alert-warning" uk-grid="true">
        <div className="uk-width-auto">
          <span className="uk-margin-small-left uk-margin-small-right" uk-icon="warning"></span>
        </div>
        <div className="uk-width-expand uk-margin-small">
          <p>Changing account-id may cause problems when finding new transactions for that platform.
            Ghostfolio may also not group transactions properly. You can reset Last Exported transaction
            on the platform screen and export all transactions again.
          </p>
        </div>
      </div>

      <p className="uk-text-right">
          <button className="uk-button uk-button-default uk-modal-close uk-margin-right" type="button">Cancel</button>
          <button className="uk-button uk-light uk-button-accent uk-modal-close" type="button" onClick={() => {onSave(settings)}}>Save</button>
      </p>
    </div>
  );
}
