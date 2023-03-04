import UIkit from "uikit";

export default class Alert {
  static info(message: string, icon?: string): void {
    const options = Alert.getOptions(message, "primary", icon);
    UIkit.notification(options);
  }

  static success(message: string, icon?: string): void {
    const options = Alert.getOptions(message, "success", icon);
    UIkit.notification(options);
  }

  static warn(message: string, icon?: string): void {
    const options = Alert.getOptions(message, "warning", icon);
    UIkit.notification(options);
  }

  static error(message: string, icon?: string): void {
    const options = Alert.getOptions(message, "danger", icon);
    UIkit.notification(options);
  }

  private static getOptions(message: string, status: any, icon?: string): UIkit.UIkitNotificationOptions {
    const iconTemplate = `<span uk-icon=\'icon: ${icon}\'></span>`;
    if (icon) message = iconTemplate.concat(" ", message);

    return {
      message,
      status,
      timeout: 10000,
      pos: "top-right",
    };
  }
}
