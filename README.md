# pholio
[![Tests](https://github.com/6ameDev/pholio/actions/workflows/tests.yml/badge.svg)](https://github.com/6ameDev/pholio/actions/workflows/tests.yml)
[![Build](https://github.com/6ameDev/pholio/actions/workflows/build.yml/badge.svg)](https://github.com/6ameDev/pholio/actions/workflows/build.yml)

Aggregate all your Investments data from different platforms (browser extension)

## Screenshots

![alt text](/screenshots/transactions.png "Transactions")
![alt text](/screenshots/settings.png "Settings")

## Roadmap 

### v1.0.0

Investment Platforms supported for Export
- [Kuvera](https://kuvera.in/)
- [Zerodha](https://console.zerodha.com/)
- [Vested](https://app.vestedfinance.com/)

Portfolio Management Tools supported for Import
- [Ghostfolio](https://ghostfol.io/) ([_github_](https://github.com/ghostfolio/ghostfolio))

## Usage

### Installing Extension
- Download the project
- Build the project
  - `npm install`
  - `npm run dev`
- Go to Extensions page in Chrome(or any chromium based browser)
- Click on `Load unpacked` button and select the `dist` directory in the downloaded project.

### Opening Extension
- Go to any tab in the browser
- Open Inspect (DevTools window)
- Go to the tab in Inspect/DevTools window with the name Pholio
