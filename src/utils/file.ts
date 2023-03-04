import DateTime from "./datetime";

export default class File {
  static downloadJson(json: object, filename: string): void {
    const datetime = DateTime.formattedNow("-");
    const filenameDatetime = filename.concat("-", datetime, ".json");

    const jsonStr = JSON.stringify(json);
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(jsonStr);

    const downloadElement = document.createElement("a");
    downloadElement.setAttribute("href", dataStr);
    downloadElement.setAttribute("download", filenameDatetime);
    document.body.appendChild(downloadElement); // required for firefox
    downloadElement.click();
    downloadElement.remove();
  }
}
