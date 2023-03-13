import { z } from "zod";

export default class KuveraValidator {
  static validate(response: object): object {
    return SCHEMA.parse(response);
  }
}

enum Type {
  BUY = "buy",
  SELL = "sell"
}

const TXN_SCHEMA = z.object({
  scheme_name: z.string(),
  trans_type: z.nativeEnum(Type),
  amount: z.coerce.number(),
  allotted_amount: z.coerce.number(),
  units: z.coerce.number(),
  nav: z.coerce.number(),
  order_date: z.string()
})

const SCHEMA = z.preprocess(filterTxns, z.array(TXN_SCHEMA))

function filterTxns(txns: any[]) {
  const ignoredTypes = new Set();
  const filtered = txns.filter((txn) => {
    const success = TXN_SCHEMA.safeParse(txn).success;
    if (!success) ignoredTypes.add(txn.type);
    return success;
  });
  console.debug(`Ignored txns of type: ${Array.from(ignoredTypes)}`);
  return filtered;
}
