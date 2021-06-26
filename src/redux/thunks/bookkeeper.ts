import {BookkeeperService} from "../../services/bookKeeper/BookkeeperService";
import {
    AccountType,
    Fund,
    FundsTransferEntry,
    FundSummary,
    FundSummaryRow,
    JournalEntry,
    TradeEntry,
    TradingAccountType
} from "../../services/bookKeeper/models";
import {Notification, setNotification} from "../slices/app/appSlice";
import {
    setActiveFund,
    setActiveFundSummary,
    setActiveSummaryRows,
    setFirm,
    setFundsTransferEntries,
    setJournalEntries,
    setTradeEntries,
} from "../slices/bookKeeper/bookkeeper";
import {setOtcAccount, setOtcAccounts} from "../slices/otc/otc";
import {RootState} from "../slices/rootSlice";

export const fetchFirm = (setActiveFund: boolean = true) => async (dispatch: any, getState: any) => {
    const firmService = new BookkeeperService();
    const firm = await firmService.getFirm();
    if (firm)
        dispatch(setFirm(firm));
    if (firm) {
        if (firm.funds.length > 0) {
            const {bookkeeper}: RootState = getState();
            const fund = !bookkeeper.activeFundId ? firm.funds[0] : firm.funds.find(fund => fund.id === bookkeeper.activeFundId);
            if (setActiveFund) {
                dispatch(setActiveFundAndOtcAccount(fund ?? firm.funds[0]));
            } else {
                dispatch(setCovarioOtcAccount(fund ?? firm.funds[0]))
            }
        }
        return firm;
    }
    return null;
};

export const setActiveFundAndOtcAccount = (fund: Fund) => async (dispatch: (arg0: (dispatch: any) => Promise<void>) => void) => {
    if (fund) {
        // @ts-ignore
        dispatch(setActiveFund(fund));
        dispatch(setCovarioOtcAccount(fund));
    }
};

const setCovarioOtcAccount = (fund: Fund) => async (dispatch: (arg0: any) => void) => {
    if (fund) {
        const otcAccount = fund.accounts.find(a => a.type === AccountType.Trading && a.tradingAccountType === TradingAccountType.OTC && a.venueCode === "covario");
        const flexibleDepositAccount = fund.accounts.find(a => a.type === AccountType.Deposit && a.subType === 'flexible')
        const fundingAccount = fund.accounts.find(a => a.type === AccountType.Funding)

        if (otcAccount) {
            dispatch(setOtcAccount(otcAccount));
            if (fundingAccount && flexibleDepositAccount)
                dispatch(setOtcAccounts([otcAccount, fundingAccount, flexibleDepositAccount]))
            else {
                dispatch(setOtcAccounts([otcAccount]))
            }
        }
    }
};

export const fetchActiveFundSummary = (fundId: string) => async (dispatch: (arg0: { payload: FundSummary | FundSummaryRow[]; type: string; }) => void) => {
    const firmService = new BookkeeperService();
    const entry = await firmService.getSummary(fundId);

    const assets = entry?.assets;
    if (assets) {
        const sum = assets.reduce((p, c) => p + +c.quantity * +c.last, 0);
        let rows: FundSummaryRow[] = assets.map((a) => {
            const isReferenceAsset = a.asset === entry.currency;
            const price = a.last ? +a.last : 0;
            const open24H = a.open24H ? +a.open24H : 0;
            const value = +a.quantity * price;
            const pctChange = open24H === 0 ? 0 : ((price - open24H) / open24H) * 100;
            const instrumentCode = isReferenceAsset ? "" : `${a.asset}-${entry.currency}`;
            const unRealizedPnl = +a.averageCost === 0 ? 0 : (price - +a.averageCost) * +a.quantity;
            return {
                assetCode: a.asset,
                instrumentCode,
                quantity: +a.quantity,
                price: isReferenceAsset ? undefined : price,
                value,
                open24H: isReferenceAsset ? undefined : open24H,
                averageCost: isReferenceAsset ? undefined : +a.averageCost,
                realizedPnl: +a.realizedProfitAndLoss,
                unrealizedPnl: unRealizedPnl,
                pctChange: pctChange,
                pct24HChange: pctChange,
                pctPortfolio: (value / sum) * 100,
            };
        });
        dispatch(setActiveSummaryRows(rows));
    }
    dispatch(setActiveFundSummary(entry));
};

export const fetchJournalEntries = (fundId: string) => async (dispatch: (arg0: { payload: JournalEntry[]; type: string; }) => void) => {
    const firmService = new BookkeeperService();
    const entries = await firmService.getJournal(fundId);
    dispatch(setJournalEntries(entries));
};

export const fetchTradeEntries = (fundId: string) => async (dispatch: (arg0: { payload: TradeEntry[] | Notification; type: string; }) => void) => {
    try {
        const firmService = new BookkeeperService();
        const entries = await firmService.getTrades(fundId);
        dispatch(setTradeEntries(entries));
    } catch (error) {
        dispatch(setNotification({
            title: "Trades",
            message: error.toString(),
            severity: "error"
        }));
        dispatch(setTradeEntries([]));
    }
};

export const fetchFundTransferEntries = (fundId: string) => async (dispatch: (arg0: { payload: FundsTransferEntry[] | Notification; type: string; }) => void) => {
    try {
        const firmService = new BookkeeperService();
        const entries = await firmService.getTransfers(fundId);
        dispatch(setFundsTransferEntries(entries));
    } catch (error) {
        dispatch(setNotification({
            title: "Fund Transfer",
            message: error.toString(),
            severity: "error"
        }));
        dispatch(setFundsTransferEntries([]));
    }
};