import * as React from "react";
import "./views/style.scss";
import Platforms from "./platforms";
import Platform from "./platforms/platform";
import Browser from "./utils/browser";
import { View as PlatformsView } from "./views/platforms";
import { View as LastTxnView } from "./views/last_transaction";
import { View as NewTxnsView } from "./views/new_transactions";
import { Ghostfolio } from "./ghostfolio";
import FileUtils from "./utils/file";
import Alert from "./utils/alert";

const PLATFORMS = Platforms.all();

let latestTxn;
let downloadableTxns: Array<any>;
let currentPlatform: Platform;

function listenPlatformClicks() {
  PLATFORMS.forEach((platform) => {
    document
      .getElementById(platform.id())
      .addEventListener("click", () => Browser.goTo(platform.txnPageUrl()));
  });
}

function listenNewTxnsActions() {
  const downloadBtn = document.getElementById("id-download");
  const markImportedBtn = document.getElementById("id-mark-imported");
  const exportBtn = document.getElementById("id-export");

  downloadBtn.addEventListener("click", downloadTxns);
  markImportedBtn.addEventListener("click", markImported);
  exportBtn.addEventListener("click", () => {console.log(`Exported clicked`)});
}

function downloadTxns() {
  const payload = Ghostfolio.createJsonImport(downloadableTxns);
  const platformName = currentPlatform.name().toLowerCase();
  const filename = `${platformName}-transactions`;
  FileUtils.downloadJson(payload, filename);
}

async function markImported() {
  console.log(`Mark Imported clicked`)
  if (latestTxn) {
    await currentPlatform.setLastTxn(latestTxn);
    Alert.success("Import marked successful.")
  }
}

Browser.render("id-platforms", <PlatformsView platforms={PLATFORMS} />, listenPlatformClicks);

Browser.afterEachRequest(async (url, body) => {
  const platform = Platforms.byApi(url);

  if (platform) {
    currentPlatform = platform;

    let lastTxn = await platform.getLastTxn();;
    Browser.render("id-last-txn", <LastTxnView txn={lastTxn} />);

    const { newTxns, latestTxnIndex } = platform.findNewTxns(body, lastTxn);
    console.log(`Latest Txn Index: ${latestTxnIndex}. \nNewTxns: %o`, newTxns);

    downloadableTxns = newTxns;
    latestTxn = newTxns[latestTxnIndex];
    Browser.render("id-new-txns", <NewTxnsView txns={newTxns} />, listenNewTxnsActions);
  }
});
