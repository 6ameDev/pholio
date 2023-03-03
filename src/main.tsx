import * as React from "react";
import Platforms from "./platforms";
import Platform from "./platforms/platform";
import Browser from "./utils/browser";
import { View as PlatformsView } from "./views/platforms";

const PLATFORMS = Platforms.all();

let currentPlatform: Platform;

function listenPlatformClicks() {
  PLATFORMS.forEach((platform) => {
    document
      .getElementById(platform.id())
      .addEventListener("click", () => Browser.goTo(platform.txnPageUrl()));
  });
}

Browser.render("id-platforms", <PlatformsView platforms={PLATFORMS} />, listenPlatformClicks);

Browser.afterEachRequest((url, body) => {
  const platform = Platforms.byApi(url);

  if (platform) {
    currentPlatform = platform;
  }
});
