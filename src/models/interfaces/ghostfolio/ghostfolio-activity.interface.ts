import { GhostfolioType } from "../../enums/ghostfolio-type.enum";
import { GhostfolioDataSource } from "../../enums/ghostfolio-datasource.enum";
import { BaseActivity } from "../base-activity.interface";

export interface GhostfolioActivity extends Omit<BaseActivity, 'type'> {
  type: GhostfolioType;
  dataSource: GhostfolioDataSource;
  comment?: string;
  accountId?: string;
}
