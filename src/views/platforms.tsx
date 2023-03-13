import React, { useState, useEffect } from "react";
import Platform from "../platforms/platform";

type cbWithPlatform = (platform: Platform) => void;

export function View({ platforms, current, onClick }:
  { platforms: Array<Platform>, current: Platform, onClick: cbWithPlatform }) {

  const [currentPlatform, setCurrentPlatform] = useState(current);

  useEffect(
    () => {
      if (currentPlatform !== current) {
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
        const isActive = platform === currentPlatform ? 'nav-active' : '';
        return (
          <div className="uk-navbar-item" key={platform.id()}>
            <button id={platform.id()} className={`uk-button uk-button-nav ${isActive}`} onClick={() => handleClick(platform)}>
              {platform.name()}
            </button>
          </div>
        );
      })}
    </div>
  );
}
