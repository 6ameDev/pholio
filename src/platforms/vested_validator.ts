import { z } from "zod";

export default class VestedValidator {
  static validate(response: object): object {
    return SCHEMA.parse(response);
  }
}

enum Type {
  SPUR = "SPUR",
  SSAL = "SSAL",
  DIV = "DIV",
  DIVTAX = "DIVTAX",
}

const TXN_SCHEMA = z.object({
  symbol: z.string(),
  type: z.nativeEnum(Type),
  amount: z.coerce.number(),
  commission: z.coerce.number(),
  quantity: z.coerce.number().default(1),
  fillPrice: z.coerce.number().optional(),
  date: z.string(),
});

const SCHEMA = z.object({
  props: z.object({
    initialReduxState: z.object({
      transactionHistory: z.object({
        userTransHistory: z.preprocess(filterTxns, z.array(TXN_SCHEMA)),
      }),
    }),
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
