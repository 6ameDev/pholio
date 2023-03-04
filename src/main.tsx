import * as React from "react";
import "./views/style.scss";
import Platforms from "./platforms";
import Platform from "./platforms/platform";
import Browser from "./utils/browser";
import { View as PlatformsView } from "./views/platforms";
import { View as NewTxnsView } from "./views/new_transactions";

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

    let lastTxn;
    const { newTxns, latestTxnIndex } = platform.findNewTxns(body, lastTxn);
    console.log(`Latest Txn Index: ${latestTxnIndex}. NewTxns: ${JSON.stringify(newTxns)}`)

    Browser.render("id-new-txns", <NewTxnsView txns={newTxns} />);
  }
});
