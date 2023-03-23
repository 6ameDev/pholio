export default interface KuveraTransaction {
  scheme_name: string;
  trans_type: string;
  amount: number;
  allotted_amount: number;
  units: number;
  nav: number;
  order_date: string;
}
