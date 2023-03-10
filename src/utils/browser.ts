import React from "react";
import { createRoot, Root } from "react-dom/client";

export default class Browser {
  static ID_ROOT_MAP = {};

  static goTo(url: string) {
    chrome.tabs.update({ url });
  }

  static afterLoadingDOM(callback: () => void) {
    document.addEventListener("DOMContentLoaded", () => callback());
  }

  static afterEachRequest(callback: (url: URL, body: string) => void) {
    chrome.devtools.network.onRequestFinished.addListener((request) => {
      request.getContent(async (body) => {
        if (request.request && request.request.url) {
          const url = new URL(request.request.url);
          const bodyDouble = body;
          callback(url, bodyDouble);
        }
      });
    });
  }

  static render(id: string, children: React.ReactNode, callback?: () => void) {
    let root: Root = Browser.ID_ROOT_MAP[id];
    const container = document.getElementById(id);

    root = root || createRoot(container!);
    Browser.ID_ROOT_MAP[id] = root;
    root.render(children);

    if (typeof callback !== "undefined") {
      requestIdleCallback(callback, { timeout: 1000 });
    }
  }
}
