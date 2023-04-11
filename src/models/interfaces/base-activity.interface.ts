import { BaseActivityType } from "../enums/base-activity-type.enum";

export interface BaseActivity {
  symbol: string;
  type: BaseActivityType;
  fee: number;
  currency: string;
  quantity: number;
  unitPrice: number;
  date: Date;
}