import { isEqual } from "lodash";
import React, { useState, useEffect } from "react";
import Platform from "../platforms/platform";
import Str from "../utils/str";

type cbWithPlatform = (platform: Platform) => void;

export function View({ platforms, current, onClick }:
  { platforms: Array<Platform>, current: Platform, onClick: cbWithPlatform }) {

  const [currentPlatform, setCurrentPlatform] = useState(current);

  useEffect(
    () => {
      if (!isEqual(currentPlatform, current)) {
        setCurrentPlatform(current);
      }
    },
    [current]
  );

  function handleClick(platform: Platform) {
    setCurrentPlatform(platform);
    onClick(platform);
  }

  return (
    <div className="uk-navbar-left">
      <ul className="uk-navbar-nav">
        <li><a href="#">Platforms</a></li>
      </ul>

      {platforms.map((platform) => {
        const isActive = isEqual(platform, currentPlatform) ? 'nav-active' : '';
        const domId = `id-${Str.hyphenate(platform.name()).toLowerCase()}`

        return (
          <div className="uk-navbar-item" key={domId}>
            <button className={`uk-button uk-button-nav ${isActive}`} onClick={() => handleClick(platform)}>
              {platform.name()}
            </button>
          </div>
        );
      })}
    </div>
  );
}
