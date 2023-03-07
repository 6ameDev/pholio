import * as React from "react";
import "./views/style.scss";
import Platforms from "./platforms";
import Platform from "./platforms/platform";
import Browser from "./utils/browser";
import { View as SettingsView } from "./views/settings";
import { View as PlatformsView } from "./views/platforms";
import { View as LastTxnView } from "./views/last_transaction";
import { View as NewTxnsView } from "./views/new_transactions";
import { Ghostfolio } from "./ghostfolio";
import FileUtils from "./utils/file";
import Alert from "./utils/alert";
import Settings from "./settings";

const PLATFORMS = Platforms.all();

let settings: Settings;
let currentPlatform: Platform;

Browser.afterLoadingDOM(async () => {
  settings = await Settings.get();
  Browser.render("id-settings", <SettingsView init={settings} onSave={saveSettings} />);
});

Browser.render("id-platforms", <PlatformsView platforms={PLATFORMS} />, listenPlatformClicks);

Browser.afterEachRequest(async (url, body) => {
  const platform = Platforms.byApi(url);

  if (platform) {
    currentPlatform = platform;

    let lastTxn = await platform.getLastTxn();
    Browser.render("id-last-txn", <LastTxnView txn={lastTxn} onReset={resetLastTxn} />);

    const account = settings.accountByPlatform(platform.name())
    const { newTxns, latestTxnIndex } = platform.findNewTxns(body, lastTxn, account.id);
    console.log(`Latest Txn Index: ${latestTxnIndex}. \nNewTxns: %o`, newTxns);

    Browser.render(
      "id-new-txns",
      <NewTxnsView txns={newTxns} latestIdx={latestTxnIndex} onExport={downloadTxns} onImported={markImported} onSync={syncTxns} />
    );
  }
});

// --------------
// Click Listeners
// --------------

function listenPlatformClicks() {
  PLATFORMS.forEach((platform) => {
    document
      .getElementById(platform.id())
      .addEventListener("click", () => Browser.goTo(platform.txnPageUrl()));
  });
}

// ------------
// User Actions
// ------------

function resetLastTxn() {
  currentPlatform.resetLastTxn();
  Alert.success(`Last Transaction has been reset`);
}

async function saveSettings(updatedSettings: Settings) {
  await updatedSettings.save();
  settings = updatedSettings;
  Alert.success(`Saved settings`);
}

function syncTxns(txns) {
  console.log(`Sync clicked`);
}

function downloadTxns(txns) {
  const payload = Ghostfolio.createJsonImport(txns);
  const platformName = currentPlatform.name().toLowerCase();
  const filename = `${platformName}-transactions`;
  FileUtils.downloadJson(payload, filename);
}

async function markImported(latestTxn) {
  if (latestTxn) {
    await currentPlatform.setLastTxn(latestTxn);
    Alert.success("Import marked successful.")
  }
}
