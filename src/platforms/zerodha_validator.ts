import { z } from "zod";

export default class VestedValidator {
  static validate(response: any): object {
    return SCHEMA.parse(response);
  }
}

enum Type {
  BUY = "buy",
  SELL = "sell"
}

const TXN_SCHEMA = z.object({
  tradingsymbol: z.string(),
  exchange: z.string(),
  trade_type: z.nativeEnum(Type),
  quantity: z.coerce.number(),
  price: z.coerce.number(),
  trade_date: z.string(),
  order_execution_time: z.string()
});

const SCHEMA = z.object({
  data: z.object({
    pagination: z.object({
      page: z.coerce.number(),
      total_pages: z.coerce.number()
    }),
    result: z.preprocess(filterTxns, z.array(TXN_SCHEMA))
  }),
});

function filterTxns(txns: any[]) {
  const ignoredTypes = new Set();
  const filtered = txns.filter((txn) => {
    const success = TXN_SCHEMA.safeParse(txn).success;
    if (!success) ignoredTypes.add(txn.type);
    return success;
  });
  console.info(`Ignored txns of type: ${Array.from(ignoredTypes)}`);
  return filtered;
}
