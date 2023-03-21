import React from "react";
import Browser from "./browser";
import PhoAlert from "../views/components/alert"

const ALERT_DOM_ID = "id-alert"

export default class Alert {
  static info(message: string): void {
    Alert.raise(message, "info");
  }

  static success(message: string): void {
    Alert.raise(message, "success");
  }

  static warn(message: string): void {
    Alert.raise(message, "warning");
  }

  static error(message: string): void {
    Alert.raise(message, "error");
  }

  private static raise(message: string, severity: 'error' | 'info' | 'success' | 'warning') {
    Browser.render(ALERT_DOM_ID, <PhoAlert message={message} severity={severity} visible={true} />);
  }
}
