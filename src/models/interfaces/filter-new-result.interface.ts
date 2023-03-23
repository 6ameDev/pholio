import { GhostfolioActivity } from "./ghostfolio-activity.interface";

export interface FilterNewResult {
  activities: GhostfolioActivity[];
  latestIndex: number;
}
