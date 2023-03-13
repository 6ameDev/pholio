import { z } from "zod";

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
        userTransHistory: z.preprocess((txns: any[]) => {
          return txns.filter((txn) => TXN_SCHEMA.safeParse(txn).success);
        }, z.array(TXN_SCHEMA)),
      }),
    }),
  }),
});

export default class VestedValidator {
  static validate(response: object): object {
    return SCHEMA.parse(response);
  }
}
