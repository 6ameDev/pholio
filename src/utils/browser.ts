export default class Browser {
  static goTo(url: string) {
    chrome.tabs.update({ url });
  }
}
