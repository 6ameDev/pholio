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

Browser.afterLoadingDOM(init);
Browser.afterEachRequest(processResponse);

// -------------------
// Lifecycle functions
// -------------------

async function init() {
  showPlatforms(PLATFORMS);
  settings = await Settings.get();
  showSettings(settings);
}

async function processResponse(url, body) {
  const platform = Platforms.byApi(url);

  if (body && platform) {
    currentPlatform = platform;
    showPlatforms(PLATFORMS, platform);

    const lastTxn = await platform.getLastTxn();
    showLastTransaction(lastTxn);

    const account = settings.accountByPlatform(platform.name())
    const { newTxns, latestTxnIndex } = platform.findNewTxns(body, lastTxn, account.id);
    console.debug(`Latest Txn Index: ${latestTxnIndex}. \nNewTxns: %o`, newTxns);

    showNewTransactions(newTxns, latestTxnIndex);
  }
}

// -------------------
// Rendering functions
// -------------------

function showPlatforms(platforms: Array<Platform>, currentPlatform?: Platform) {
  Browser.render(
    "id-platforms",
    <PlatformsView platforms={platforms} current={currentPlatform} onClick={openTxnsPage} />);
}

function showSettings(settings: Settings) {
  Browser.render("id-settings", <SettingsView init={settings} onSave={saveSettings} />);
}

function showLastTransaction(lastTxn: any) {
  Browser.render("id-last-txn", <LastTxnView platform={currentPlatform} txn={lastTxn} onReset={resetLastTxn} />);
}

function showNewTransactions(newTxns: object[], latestTxnIndex: number) {
  Browser.render(
    "id-new-txns",
    <NewTxnsView
      platform={currentPlatform} txns={newTxns} latestIdx={latestTxnIndex}
      onExport={downloadTxns} onImported={markImported} onSync={syncTxns} />
  );
}

// ------------
// User Actions
// ------------

function resetView() {
  showLastTransaction(undefined);
  showNewTransactions([], -1);
}

function openTxnsPage(platform: Platform) {
  resetView();
  Browser.goTo(platform.txnPageUrl());
  currentPlatform = platform;
}

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
  await currentPlatform.setLastTxn(latestTxn);
  Alert.success("Import marked successful.");
  showLastTransaction(latestTxn);
}
