import { AssetConfig } from "./asset-config.interface";
import { GhostfolioActivity } from "./ghostfolio-activity.interface";

export interface TransformResult {
  activities?: GhostfolioActivity[];
  toStore?: AssetConfig[];
  missing?: AssetConfig[];
}