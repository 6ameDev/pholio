import { z } from "zod";

const Transaction: z.ZodTypeAny = z.object({
  symbol: z.string(),
  type: z.string(),
  commission: z.coerce.number(),
  quantity: z.coerce.number().optional(),
  fillPrice: z.coerce.number().optional(),
  amount: z.coerce.number(),
  date: z.string()
});

const Response = z.object({
  props: z.object({
    initialReduxState: z.object({
      transactionHistory: z.object({
        userTransHistory: z.array(Transaction)
      })
    })
  })
})

const txnRes = {"type":"SPUR","description":"Coinbase Global Inc  MARKET Buy","amount":"1248.10","commission":0,"symbol":"COIN","quantity":"26.70000000","fillPrice":"46.75000000","sign":"-","date":"Jun 30, 2022"}

export function validateTxn() {
  return Transaction.parse(txnRes);
}
