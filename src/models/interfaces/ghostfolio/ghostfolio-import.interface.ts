import { GhostfolioActivity } from "./ghostfolio-activity.interface";

export interface GhostfolioImport {
  meta: {
    date: Date;
    version: string;
  };
  activities: GhostfolioActivity[];
}
