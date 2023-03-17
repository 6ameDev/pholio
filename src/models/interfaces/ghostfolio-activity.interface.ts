import { GhostfolioType } from "../enums/ghostfolio-type.enum";
import { GhostfolioDataSource } from "../enums/ghostfolio-datasource.enum";

export interface GhostfolioActivity {
  symbol: string;
  type: GhostfolioType;
  fee: number;
  currency: string;
  quantity: number;
  unitPrice: number;
  dataSource: GhostfolioDataSource;
  date: Date;
  comment?: string;
  accountId?: string;
}
