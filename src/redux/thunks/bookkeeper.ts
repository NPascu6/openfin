import {BookkeeperService} from "../../services/bookKeeper/BookkeeperService";
import {Fund, FundSummary, FundSummaryRow, JournalEntry,} from "../../services/bookKeeper/models";
import {
    setActiveFund,
    setActiveFundSummary,
    setActiveSummaryRows,
    setFirm,
    setJournalEntries,
} from "../slices/bookKeeper/bookkeeper";
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
    }
};

export const fetchActiveFundSummary = (fundId: string) => async (dispatch: (arg0: { payload: FundSummary | FundSummaryRow[]; type: string; }) => void) => {
    const firmService = new BookkeeperService();
    const entry = await firmService.getSummary(fundId);

    const assets = entry?.assets;
    if (assets) {
        const sum = assets.reduce((p, c) => p + +c.quantity * +c.last, 0);
        let rows: FundSummaryRow[] = assets.filter(a => a.quantity > 0).map((a) => {
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