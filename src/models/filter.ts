import { isEqual } from "lodash";
import Alert from "../utils/alert";
import { FilterNewResult } from "./interfaces/filter-new-result.interface";
import { GhostfolioActivity as Activity } from "./interfaces/ghostfolio/ghostfolio-activity.interface";

export default class Filter {

  filterNew(activities: Activity[], last?: Activity): FilterNewResult {
    if(last) {
      last["accountId"] = last["accountId"]; // assists isEqual matching when accountId is undefined
      const index = activities.findIndex(activity => isEqual(activity, last));

      const preLast = activities.slice(0, index);
      const postLast = activities.slice(index + 1);
      const endOfPostLast = postLast.slice(-1)[0];

      if (preLast.length > 0 && preLast[0].date > last.date) {
        return { activities: preLast, latestIndex: 0 };
      }
      if (postLast.length > 0 && endOfPostLast.date > last.date) {
        return { activities: postLast, latestIndex: postLast.length - 1 };
      }

      console.debug(
        `Could not identify new activities. Last's index: ${index}.
         Last: %o. Pre last: %o. Post last: %o`, last, preLast, postLast
      );

      return { activities: [], latestIndex: -1 };
    } else {
      return {
        activities: activities,
        latestIndex: this.findLatestIndex(activities),
      };
    }
  }

  private findLatestIndex(activities: Activity[]) {
    const first = activities[0];
    const last = activities.slice(-1)[0];

    if (!first || !last) {
      return -1;
    }
    if (first !== last && first.date === last.date) {
      Alert.error(`Failed to identify latest txn`);
      console.error(`Failed to identify latest txn, dates of all activities are same.`);
      return -1;
    }
    return first.date > last.date ? 0 : activities.length - 1;
  }
}