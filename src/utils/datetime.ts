export default class DateTime {
  static formattedNow(separator?: string): string {
    const options: Intl.DateTimeFormatOptions = {
      dateStyle: "medium", timeStyle: "medium", hourCycle: "h24"
    }

    const dateStr = new Date().toLocaleString("en-US", options);

    if (separator)
      return dateStr.replace(/, |:| /g, separator).toLowerCase();
    else
      return dateStr;
  }
}
