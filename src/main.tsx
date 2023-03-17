import * as React from "react";
import "./views/style.scss";
import Platforms from "./platforms";
import Platform from "./platforms/platform";
import Browser from "./utils/browser";
import { View as ConfigsView } from "./views/configs";
import { View as SettingsView } from "./views/settings";
import { View as PlatformsView } from "./views/platforms";
import { View as LastTxnView } from "./views/last_transaction";
import { View as NewTxnsView } from "./views/new_transactions";
import FileUtils from "./utils/file";
import Alert from "./utils/alert";
import Settings from "./models/settings";
import AssetConfigs from "./models/asset-configs";
import Ghostfolio from "./models/ghostfolio";
import SettingsV2 from "./views/settingsv2/menu";

let configs: AssetConfigs;
let settings: Settings;
let currentPlatform: Platform;

Browser.afterLoadingDOM(init);
Browser.afterEachRequest(processResponse);

// -------------------
// Lifecycle functions
// -------------------

async function init() {
  configs = await AssetConfigs.fetch();
  settings = await Settings.get();
  showSettings(settings);
  showConfigs(configs);
  showPlatforms();
  await Ghostfolio.saveConfig({host: 'foo', securityToken: 'bar'})
  console.log(`GF Config`, await Ghostfolio.fetchConfig());
}

async function processResponse(url, body) {
  const platform = new Platforms(configs, settings).byApi(url);

  if (body && platform) {
    currentPlatform = platform;
    showPlatforms(platform);

    const lastTxn = await platform.getLastTxn();
    showLastTransaction(lastTxn);

    const { newTxns, latestTxnIndex, missing } = platform.findNewTxns(body, lastTxn);

    if (missing && missing.length > 0) {
      console.debug(`Missing configs: %o`, missing);
      handleMissingData(missing);
    } else {
      console.debug(`Latest Txn Index: ${latestTxnIndex}. \nNewTxns: %o`, newTxns);
      showNewTransactions(newTxns, latestTxnIndex);
    }
  }
}

// -------------------
// Rendering functions
// -------------------

function showPlatforms(currentPlatform?: Platform) {
  const platforms = new Platforms(configs, settings);
  Browser.render(
    "id-platforms",
    <PlatformsView platforms={platforms.all()} current={currentPlatform} onClick={openTxnsPage} />);
}

function showConfigs(configs: any) {
  // Browser.render("id-configs", <ConfigsView init={configs} onSave={saveConfigs} />);
  Browser.render("id-configs", <SettingsV2 />);
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

// ---------
// Scenarios
// ---------

function handleMissingData(missing: { name: string, values: any[]}[]) {
  missing.map((item) => {
    if (item.name === "Configs.Asset") {
      configs.addAssets(item.values).save();
      showConfigs(configs);
      Alert.error(`Missing configs. Go to configs menu.`)
    } else {
      console.error(`Unrecognised missing data: %o`, item);
    }
  });
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

async function saveConfigs(updatedConfigs: AssetConfigs) {
  await updatedConfigs.save();
  configs = updatedConfigs;
  Alert.success(`Saved configs`);
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
  const payload = Ghostfolio.createImport(txns);
  const platformName = currentPlatform.name().toLowerCase();
  const filename = `${platformName}-transactions`;
  FileUtils.downloadJson(payload, filename);
}

async function markImported(latestTxn) {
  await currentPlatform.setLastTxn(latestTxn);
  Alert.success("Import marked successful.");
  showLastTransaction(latestTxn);
}
