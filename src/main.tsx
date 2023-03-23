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
import { TransactionsProps } from "./views/transactions";
import { AssetConfig } from "./models/interfaces/asset-config.interface";
import { GhostfolioActivity as Activity } from "./models/interfaces/ghostfolio-activity.interface";

const platforms = Platforms.getInstance();
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
  const platform = platforms.byApi(url);

  if (body && platform) {
    currentPlatform = platform;

    const { status, transactions, dePagination } = platform.dePaginate(body);

    if (status === "finished") {
      const { activities, missing, toStore } = await platform.transform(transactions);

      if (missing && missing.length) {
        handleMissing(missing);
      } else {
        if (toStore && toStore.length > 0) storeConfigs(toStore);

        const lastTxn = await platform.getLastTxn();
        const { activities: newActivities, latestIndex } = platform.filterNew(activities, lastTxn as Activity);

        console.debug(`Latest txn index: ${latestIndex}. New txns: %o`, newActivities);
        loadHome(newActivities, latestIndex, lastTxn);
      }
    }
  }
}

// -------------------
// Rendering functions
// -------------------

async function loadHome(txns?: any[], latestIndex?: number, lastTxn?: any) {
  const gfConfig = await Ghostfolio.fetchConfig();
  const allPlatforms = platforms.all();

  const transactionProps: TransactionsProps = {
    txns, latestIndex, lastExported: lastTxn, platform: currentPlatform,
    onReset: resetLastTxn, onExport: downloadTxns, onImported: markImported, onSync: syncTxns
  };

  Browser.render(
    "id-nav",
    <Homepage
      currentPlatform={currentPlatform}
      platformProps={{ platforms: allPlatforms, onClick: openTxnsPage }}
      transactionProps={transactionProps}
      assetsPanelParams={{ assetConfigs, gfClient, onSave: saveAssetConfigs }}
      platformsPanelProps={{ platformConfigs, onSave: savePlatformConfigs }}
      ghostfolioPanelProps={{ config: gfConfig, onSave: saveGhostfolioConfig }}
    />);
}

// ---------
// Scenarios
// ---------

function storeConfigs(newConfigs: AssetConfig[]) {
  console.debug(`Received configs to be stored: %o`, newConfigs);
  assetConfigs
    .addAssets(newConfigs)
    .save()
    .then(
      async () => assetConfigs = await AssetConfigs.fetch(),
      (reason) => {
        console.error("Failed to store new AssetConfigs. Reason: ", reason);
      }
    );
}

function handleMissing(configs: AssetConfig[]) {
  console.debug(`Missing configs: %o`, configs);
  assetConfigs
    .addAssets(configs)
    .save()
    .then(
      async () => {
        assetConfigs = await AssetConfigs.fetch();
        loadHome();
        Alert.error(`Missing Asset configs. Check Settings > Assets`)
      },
      (reason) => {
        console.error("Failed to store missing configs. Reason: ", reason);
      }
    );
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
