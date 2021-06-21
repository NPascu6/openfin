export interface NewFirm {
    name: string;
    description: string;
}

export interface NewUser {
    firmId: string;
    email: string;
}

export interface Firm extends NewFirm {
    id: string;
    funds: Fund[];
    users?: any[]
}

export interface NewFund {
    firmId: string;
    name: string;
    description: string;
    currency: string;
}


export interface NewUserRole {
    userId: string;
    fundId: string;
    type: string;
}

export interface Fund extends NewFund {
    id: string;
    accounts: Account[];
}

export interface NewAccount {
    fundId?: string,
    type?: string;
    tradingAccountType?: string;
    tradeType: string;
    venueCode: string;
    subType?: string;
    depositType?: DepositType;
    balances: Balances;
}

export interface Account extends NewAccount {
    id: string;
}

export interface Balances {
    total: any;
    available: any;
    sequester: any;
    interest: any;
    apr: any;
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
    amount: number | string;
    netPrice: number | string;
    grossPrice: number | string;
    executionPrice: number | string;
    fee: number | string;
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

export interface FundTransferModel {
    referenceId: string,
    senderId: string,
    receiverId: string,
    vendorCode: string,
    asset: string,
    amount: number,
    fee: number,
    feeCurrency: string,
    transferType: string,
    timestamp: any,
    comment: string
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
    realizedProfitAndLoss: number;
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

export interface BookSpotTradeModel {
    fundId?: string;
    referenceId: string;
    accountId: string;
    instrumentCode: string;
    instrumentType: string;
    sideType: string;
    quantity: number;
    price: number;
    executionPrice: number;
    fee?: number;
    feeCurrency?: string;
    executionVenue: string;
    executionOrigin: string;
    timestamp: object;
    comment: string;
    rate?: string;
    traderEmail: string;
}

export enum OrderOrigin {
    Api = 'api',
    Telephone = 'telephone',
    Chat = 'chat',
    Email = 'email'
}

export enum TradeType {
    Spot = "spot",
    Margin = "margin",
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
    DMA = "dma",
    Deposit = "deposit"
}