export interface Firm {
    id: string;
    name: string;
    description: string;
    funds: Fund[];
}

export interface Fund {
    id: string;
    firmId: string;
    name: string;
    description: string;
    currency: string;
    accounts: Account[];
}

export interface Account {
    id: string;
    type: AccountType;
    subType?: string;
    tradingAccountType?: TradingAccountType;
    tradeType?: TradeType;
    depositType?: DepositType;
    venueCode: string;
    balances: Balances;
}

export interface Balances {
    total: Balance;
    available: Balance;
    sequester: Balance;
    interest: Balance;
    apr: Balance;
}

export interface Balance extends Record<string, number | string> {

}

export interface JournalEntry {
    id: string;
    referenceId: string;
    accountId: string;
    asset: string;
    assetType: string;
    entryType: string;
    entrySubType: string;
    amount: number | string;
    isCredit: boolean;
    timestamp: string;
    comment: string;
    updatedBy: string;
    updatedAt: string;
}

export interface TradeEntry {
    id: string;
    referenceId: string;
    accountId: string;
    instrumentCode: string;
    instrumentType: string;
    sideType: string;
    quantity: number | string;
    price: number | string;
    executionPrice: number | string;
    fees: number[] | string[];
    feesAggregated: number | string,
    feeCurrency: string;
    timestamp: string;
    comment: string;
}

export interface FundsTransferEntry {
    id: string;
    fundId: string;
    senderId: string;
    senderType: string;
    receiverId: string;
    receiverType: string;
    asset: string;
    amount: number | string;
    fee: number | string;
    feeCurrency: string;
    status: string;
    timestamp: string;
    comment: string;
    reason: string;
    updatedBy: string;
    updatedAt: string;
}

export interface FundSummary {
    currency: string;
    assets: FundSummaryAsset[];
}

export interface FundSummaryAsset {
    asset: string;
    quantity: number | string;
    last: number | string;
    open24H: number | string;
    averageCost: number | string;
    realizedProfitAndLoss: number | string;
}

export interface FundSummaryRow {
    assetCode: string;
    instrumentCode?: string;
    quantity?: number;
    price?: number;
    value?: number;
    open24H?: number;
    averageCost?: number;
    realizedPnl?: number;
    unrealizedPnl?: number;
    pctChange?: number;
    pct24HChange?: number,
    pctPortfolio?: number;
}

export enum TradeType {
    Spot = "spot",
    Margin = "spot",
    Futures = "futures",
    Swaps = "swaps",
    Options = "options",
}

export enum DepositType {
    Savings = "savings"
}

export enum AccountType {
    Funding = "funding",
    Trading = "trading",
    Deposit = "deposit"
}

export enum TradingAccountType {
    OTC = "otc",
    DMA = "dma"
}