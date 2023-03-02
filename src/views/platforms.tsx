import React from "react";
import Platforms from "../platforms";

export function Show() {
  return (
    <div className="uk-navbar-left">
      <ul className="uk-navbar-nav">
        <li className="uk-active"><a href="#">Platforms</a></li>
      </ul>

      {showButtons(Platforms.all())}
    </div>
  );
}

function showButtons(platforms: Array<any>) {
  return platforms.map((platform) => {
    return (
      <div className="uk-navbar-item" key={platform.id()}>
        <button id={platform.id()} className="uk-button uk-button-default">{platform.name()}</button>
      </div>
    );
  });
}
