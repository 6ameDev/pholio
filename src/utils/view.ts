export default class View {
  static formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric", month: "short", day: "numeric"
    };
    return date.toLocaleDateString("en-US", options);
  }

  static formatCurrency(value: number, currency: string): string {
    return value.toString().concat(" ", currency);
  }

  static calcAmount(quantity: number, unitPrice: number, currency: string): string {
    const amount = Math.round(quantity * unitPrice);
    return View.formatCurrency(amount, currency);
  }
}
