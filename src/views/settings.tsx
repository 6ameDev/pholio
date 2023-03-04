import React from "react";

export function View({ platforms }: { platforms: Array<any> }) {
  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button className="uk-modal-close-default" type="button" uk-close="true"></button>

      <h4>Pholio Settings</h4>
      <form className="uk-form-horizontal uk-margin-large">
        <div className="uk-margin uk-inline inline-unblock">
            <label className="uk-form-label" htmlFor="form-horizontal-text">Ghostfolio Host</label>
            <div className="uk-form-controls">
                <a className="uk-form-icon uk-form-icon-flip" href="#" uk-icon="icon: refresh"></a>
                <input className="uk-input uk-form-blank" id="form-horizontal-text" type="text" placeholder="Example: http://192.168.0.10:3333" />
            </div>
        </div>
        <hr />
        {platforms.map((platform) => {
          return (
            <div className="uk-margin" key={platform.id()}>
              <label className="uk-form-label" htmlFor="form-horizontal-text">{platform.name()} Account Id</label>
              <div className="uk-form-controls">
                  <input className="uk-input" id="form-horizontal-text" type="text" placeholder={platform.name() + " Account Id on Ghostfolio"} />
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
