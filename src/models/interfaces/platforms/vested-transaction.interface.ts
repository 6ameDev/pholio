export default interface VestedTransaction {
  symbol: string;
  type: string;
  amount: number;
  commission: number;
  quantity: number;
  fillPrice: number;
  date: string;
}
