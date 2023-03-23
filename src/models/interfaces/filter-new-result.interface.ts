import { GhostfolioActivity } from "./ghostfolio/ghostfolio-activity.interface";

export interface FilterNewResult {
  activities: GhostfolioActivity[];
  latestIndex: number;
}
