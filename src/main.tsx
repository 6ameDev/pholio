import React from "react";
import "./views/style.scss";
import Platforms from "./platforms";
import Platform from "./platforms/platform";
import Browser from "./utils/browser";
import FileUtils from "./utils/file";
import Alert from "./utils/alert";
import AssetConfigs from "./models/asset-configs";
import Ghostfolio from "./models/ghostfolio";
import GfClient from "./external/ghostfolio/client";
import { GhostfolioConfig } from "./models/interfaces/ghostfolio-config.interface";
import PlatformConfigs from "./models/platform-configs";
import Homepage from "./views/homepage";

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
  loadHome();
}

async function processResponse(url, body) {
  const platform = new Platforms(assetConfigs, platformConfigs).byApi(url);

  if (body && platform) {
    currentPlatform = platform;

    const lastTxn = await platform.getLastTxn();
    let { newTxns, latestTxnIndex, missing } = platform.findNewTxns(body, lastTxn);

    console.debug(`Latest Txn Index: ${latestTxnIndex}. \nNewTxns: %o`, newTxns);
    loadHome(newTxns, latestTxnIndex, lastTxn);

    if (missing && missing.length > 0) {
      handleMissingConfigs(missing);
    }
  }
}

// -------------------
// Rendering functions
// -------------------

async function loadHome(txns?: any[], latestIndex?: number, lastTxn?: any) {
  const gfConfig = await Ghostfolio.fetchConfig();
  const platforms = new Platforms(assetConfigs, platformConfigs).all();
  Browser.render(
    "id-nav",
    <Homepage
      currentPlatform={currentPlatform}
      platformProps={{ platforms, onClick: openTxnsPage }}
      transactionProps={{ txns, latestIndex , lastExported: lastTxn, platform: currentPlatform,
                          onReset:resetLastTxn, onExport:downloadTxns, onImported:markImported, onSync:syncTxns }}
      assetsPanelParams={{ assetConfigs, gfClient, onSave: saveAssetConfigs }}
      platformsPanelProps={{ platformConfigs, onSave: savePlatformConfigs }}
      ghostfolioPanelProps={{ config: gfConfig, onSave: saveGhostfolioConfig }}
    />);
}

// ---------
// Scenarios
// ---------

function handleMissingConfigs(missing: { name: string, values: any[]}[]) {
  console.debug(`Missing configs: %o`, missing);
  missing.map(async (item) => {
    if (item.name === "AssetConfig") {
      assetConfigs.addAssets(item.values).save();
      assetConfigs = await AssetConfigs.fetch();
      loadHome();
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
  loadHome();
}

function openTxnsPage(platform: Platform) {
  resetView();
  Browser.goTo(platform.txnPageUrl());
  currentPlatform = platform;
}

function resetLastTxn() {
  currentPlatform
    .resetLastTxn()
    .then(
      () => {
        Alert.success(`Last transaction has been reset`);
        openTxnsPage(currentPlatform);
      },
      () => Alert.error(`Failed to reset last transaction`));
}

function saveGhostfolioConfig(updatedConfig: GhostfolioConfig) {
  Ghostfolio
    .saveConfig(updatedConfig)
    .then(
      async () => {
        Alert.success(`Saved Ghostfolio config`);
        gfClient = await GfClient.refreshInstance();
        loadHome();
      },
      () => Alert.error(`Failed to save Ghostfolio config`));
}

function savePlatformConfigs(updatedConfigs: PlatformConfigs) {
  updatedConfigs
    .save()
    .then(() => Alert.success(`Saved Platform configs`),
          () => Alert.error(`Failed to save Platform configs`));
  platformConfigs = updatedConfigs;
}

function saveAssetConfigs(updatedConfigs: AssetConfigs) {
  updatedConfigs
    .save()
    .then(
      () => {
        Alert.success(`Saved Asset configs`)
        assetConfigs = updatedConfigs;
      },
      () => Alert.error(`Failed to save Asset configs`));
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

function markImported(latestTxn) {
  currentPlatform
    .setLastTxn(latestTxn)
    .then(
      () => {
        Alert.success("Import marked successful.");
        loadHome([], 0, latestTxn);
      },
      () => Alert.error(`Failed to mark imported`));
}
