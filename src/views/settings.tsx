import React, { useState } from "react";

export function View({ userSettings }: { userSettings: any }) {

  const GF_HOST_PLACEHOLDER = "Example: http://192.168.0.10:3333";

  const [gfHost, setGfHost] = useState(userSettings.ghostfolioHost);
  const [accounts, setAccounts] = useState(userSettings.accounts);

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
          const placeholder = `${account.name} Account Id on Ghostfolio`;

          return (
            <div className="uk-margin" key={domId}>
              <label className="uk-form-label" htmlFor={domId}>{account.name} Account Id</label>
              <div className="uk-form-controls">
                  <input className="uk-input" type="text" id={domId} placeholder={placeholder}
                          value={account.id} onChange={ e => onAccountIdChange(account.name, e.target.value) } />
              </div>
            </div>
          );
        })}
      </form>
      <p className="uk-text-right">
          <button className="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
          <button className="uk-button uk-button-primary uk-margin-left" type="button">Save</button>
      </p>
    </div>
  );
}
