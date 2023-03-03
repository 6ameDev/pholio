import React from "react";
import { createRoot } from "react-dom/client";

export default class Browser {
  static goTo(url: string) {
    chrome.tabs.update({ url });
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
    const container = document.getElementById(id);
    createRoot(container!).render(children);

    if (typeof callback !== "undefined") {
      requestIdleCallback(callback, { timeout: 1000 });
    }
  }
}
