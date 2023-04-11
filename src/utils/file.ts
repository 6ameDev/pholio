import DateTime from "./datetime";
import { Parser } from '@json2csv/plainjs';

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

  static downloadCSV(content: any, filename: string): void {
    const datetime = DateTime.formattedNow("-");
    const filenameDatetime = filename.concat("-", datetime, ".csv");

    try {
      const parser = new Parser();
      const csv = parser.parse(content);
      const data = 'data:text/csv;charset=utf-8,' + encodeURI(csv);  

      const downloadElement = document.createElement("a");
      downloadElement.setAttribute("href", data);
      downloadElement.setAttribute("download", filenameDatetime);
      document.body.appendChild(downloadElement); // required for firefox
      downloadElement.click();
      downloadElement.remove();
    } catch (err) {
      console.error("Failed to parse CSV", err);
    }
  }
}
