export default class View {
  static formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric", month: "short", day: "numeric"
    };
    return date.toLocaleDateString("en-US", options);
  }

  static currencyFormatter(currency: string, locale?: string) {
    const localeWithFallback = locale || "en-US";
    return Intl.NumberFormat(localeWithFallback, {
      notation: "compact",
      style: "currency",
      currency: currency
    });
  }

  static formatCurrency(value: number, currency: string, locale?: string): string {
    const formatter = View.currencyFormatter(currency, locale);
    return formatter.format(value);
  }

  static calcAmount(quantity: number, unitPrice: number, currency: string, locale?: string): string {
    const amount = Math.round(quantity * unitPrice);
    return View.formatCurrency(amount, currency, locale);
  }
}
