import React from "react";
import Platform from "../platforms/platform";

export function View({ platforms }: { platforms: Array<Platform> }) {
  return (
    <div className="uk-navbar-left">
      <ul className="uk-navbar-nav">
        <li className="uk-active"><a href="#">Platforms</a></li>
      </ul>

      {platforms.map((platform) => {
        return (
          <div className="uk-navbar-item" key={platform.id()}>
            <button id={platform.id()} className="uk-button uk-button-default">
              {platform.name()}
            </button>
          </div>
        );
      })}
    </div>
  );
}
