import Jsun from "../../utils/jsun";
import Str from "../../utils/str";
import Platform from "./platform";
import Validator from "../validators/vested_validator";
import { GhostfolioType as GfType } from "../enums/ghostfolio-type.enum";
import Ghostfolio from "../ghostfolio";
import { GhostfolioDataSource as GfDataSource } from "../enums/ghostfolio-datasource.enum";
import Depaginator, { DepaginationResult } from "../depaginator";
import PlatformConfigs from "../platform-configs";
import { TransformResult } from "../interfaces/transform-result.interface";
import AssetConfigs from "../asset-configs";
import Filter from "../filter";
import Transaction from "../interfaces/platforms/vested-transaction.interface";

const TXN_RESPONSE_PATH = ["props", "initialReduxState", "transactionHistory", "userTransHistory"];
const RESPONSE_BOUNDS = ['<script id="__NEXT_DATA__" type="application/json">', "</script>"];

const TXN_TYPE_MAP = {
  SPUR: { type: GfType.BUY, comment: 'BUY' },
  SSAL: { type: GfType.SELL, comment: 'SELL' },
  DIV: { type: GfType.DIVIDEND, comment: 'DIVIDEND' },
  DIVTAX: { type: GfType.ITEM, comment: 'DIVIDEND TAX' }
}

const CURRENCY = 'USD';

export default class Vested extends Platform {
  readonly locale = "en-US";

  constructor() {
    super(new Depaginator<Transaction>(), new Filter());
  }

  name(): string {
    return "Vested";
  }

  txnApi(): URL {
    return new URL("https://app.vestedfinance.com/transaction-history");
  }

  txnPageUrl(): string {
    return "https://app.vestedfinance.com/transaction-history";
  }

  resolveSymbol(symbol: string, configs: AssetConfigs): string {
    return symbol;
  }

  dePaginate(body: string): DepaginationResult<Transaction> {
    const response = this.jsonParse(body);
    const validated = Validator.validate(response);
    console.debug(`Validated Response: `, validated);

    const transactions = Jsun.walk(validated, TXN_RESPONSE_PATH) as Transaction[];
    return this.depaginator.dePaginate(transactions);
  }

  transform(transactions: Transaction[]): Promise<TransformResult> {
    return this.transformTxns(transactions).then(
      (transformed) => {
        return { activities: transformed };
      },
      (reason) => {
        console.error(`Failed to transform. Reason: %o`, reason);
        return {};
      }
    );
  }

  private async transformTxns(transactions: Transaction[]) {
    const platformConfigs = await PlatformConfigs.fetch();
    const accountId = platformConfigs.configByPlatform(this.name()).id;

    return transactions.reduce((result, txn) => {
      result.push(this.transformTxn(txn, accountId));
      return result;
    }, []);
  }

  private transformTxn(txn: Transaction, accountId: string) {
    return Ghostfolio.createActivity(
      txn.symbol,
      TXN_TYPE_MAP[txn.type].type,
      txn.commission,
      CURRENCY,
      txn.quantity,
      txn.fillPrice || txn.amount,
      GfDataSource.YAHOO,
      new Date(txn.date),
      TXN_TYPE_MAP[txn.type].comment,
      accountId
    );
  }

  private jsonParse(body: string): object {
    const response = Str.subString(body, RESPONSE_BOUNDS);
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error(`${this.name()}: Failed to parse transactions. Body: ${body}`);
    }
  }
}
