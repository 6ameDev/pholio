import * as React from "react";
import { createRoot } from "react-dom/client";
import "./greet.scss";
import Platforms from "./platforms";
import Browser from "./utils/browser";
import { View as PlatformsView } from "./views/platforms";

const PLATFORMS = Platforms.all();

function render(id: string, children: React.ReactNode) {
  const container = document.getElementById(id);
  createRoot(container!).render(children);
}

function ShowPlatforms() {
  return PlatformsView(PLATFORMS);
}

function addPlatformClickListeners() {
  PLATFORMS.forEach((platform) => {
    document
      .getElementById(platform.id())
      .addEventListener("click", () => Browser.goTo(platform.txnPageUrl()));
  });
}

render("id-platforms", <ShowPlatforms />);
requestIdleCallback(addPlatformClickListeners, { timeout: 1000 });
