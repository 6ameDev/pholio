import * as React from "react";
import "./views/style.scss";
import Platforms from "./platforms";
import Platform from "./platforms/platform";
import Browser from "./utils/browser";
import { View as PlatformsView } from "./views/platforms";
import { View as LastTxnView } from "./views/last_transaction";
import { View as NewTxnsView } from "./views/new_transactions";
import FileUtils from "./utils/file";
import Alert from "./utils/alert";
import AssetConfigs from "./models/asset-configs";
import Ghostfolio from "./models/ghostfolio";
import SettingsV2 from "./views/settingsv2/menu";
import GfClient from "./external/ghostfolio/client";
import { GhostfolioConfig } from "./models/interfaces/ghostfolio-config.interface";
import PlatformConfigs from "./models/platform-configs";

let gfClient: GfClient;
let currentPlatform: Platform;
let assetConfigs: AssetConfigs;
let platformConfigs: PlatformConfigs;

Browser.afterLoadingDOM(init);
Browser.afterEachRequest(processResponse);

// -------------------
// Lifecycle functions
// -------------------

async function init() {
  gfClient = await GfClient.getInstance();
  assetConfigs = await AssetConfigs.fetch();
  platformConfigs = await PlatformConfigs.fetch();
  loadSettings();
  loadPlatforms();
}

async function processResponse(url, body) {
  const platform = new Platforms(assetConfigs, platformConfigs).byApi(url);

  if (body && platform) {
    currentPlatform = platform;
    loadPlatforms(platform);

    const lastTxn = await platform.getLastTxn();
    loadLastTransaction(lastTxn);

    const { newTxns, latestTxnIndex, missing } = platform.findNewTxns(body, lastTxn);

    if (missing && missing.length > 0) {
      console.debug(`Missing configs: %o`, missing);
      handleMissingData(missing);
    } else {
      console.debug(`Latest Txn Index: ${latestTxnIndex}. \nNewTxns: %o`, newTxns);
      loadNewTransactions(newTxns, latestTxnIndex);
    }
  }
}

// -------------------
// Rendering functions
// -------------------

function loadPlatforms(currentPlatform?: Platform) {
  const platforms = new Platforms(assetConfigs, platformConfigs);
  Browser.render(
    "id-platforms",
    <PlatformsView platforms={platforms.all()} current={currentPlatform} onClick={openTxnsPage} />);
}

async function loadSettings() {
  const gfConfig = await Ghostfolio.fetchConfig();
  Browser.render(
    "id-settings",
    <SettingsV2
      assetsPanelParams={{ assetConfigs, gfClient, onSave: saveAssetConfigs }}
      platformsPanelProps={{ platformConfigs, onSave: savePlatformConfigs }}
      ghostfolioPanelProps={{ config: gfConfig, onSave: saveGhostfolioConfig }}/>);
}

function loadLastTransaction(lastTxn: any) {
  Browser.render("id-last-txn", <LastTxnView platform={currentPlatform} txn={lastTxn} onReset={resetLastTxn} />);
}

function loadNewTransactions(newTxns: object[], latestTxnIndex: number) {
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
  missing.map(async (item) => {
    if (item.name === "AssetConfig") {
      assetConfigs.addAssets(item.values).save();
      assetConfigs = await AssetConfigs.fetch();
      loadSettings();
      Alert.error(`Missing Asset configs. Check Settings > Assets`)
    } else {
      console.error(`Unrecognised missing data: %o`, item);
    }
  });
}

// ------------
// User Actions
// ------------

function resetView() {
  loadLastTransaction(undefined);
  loadNewTransactions([], -1);
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

async function saveGhostfolioConfig(updatedConfig: GhostfolioConfig) {
  Ghostfolio
    .saveConfig(updatedConfig)
    .then(() => Alert.success(`Saved Ghostfolio config`),
          () => Alert.error(`Failed to save Ghostfolio config`));

  gfClient = await GfClient.refreshInstance();
  loadSettings();
}

async function savePlatformConfigs(updatedConfigs: PlatformConfigs) {
  updatedConfigs
    .save()
    .then(() => Alert.success(`Saved Platform configs`),
          () => Alert.error(`Failed to save Platform configs`));
  platformConfigs = updatedConfigs;
}

async function saveAssetConfigs(updatedConfigs: AssetConfigs) {
  updatedConfigs
    .save()
    .then(() => Alert.success(`Saved Asset configs`),
          () => Alert.error(`Failed to save Asset configs`));
  assetConfigs = updatedConfigs;
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
  loadLastTransaction(latestTxn);
}
