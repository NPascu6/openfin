import {Currency, SpotInstrument} from "../services/instrument/models";

export const getCurrencyByAssetCode = (assetCode: string, currencies: Currency[]): Currency => {
    if (currencies?.length > 0) {
        const currency = currencies.find((c) => c.code === assetCode.toUpperCase());

        if (currency) return currency;
    }

    return {
        code: assetCode,
        name: assetCode,
        description: assetCode,
        type: '',
        active: false,
    };
};

export const getCurrenciesByCodes = (codes: string[], currencies: Currency[]): Currency[] => {
    return codes.map(c => getCurrencyByAssetCode(c, currencies));
}

export const getCurrencyByCode = (code: string, currencies: Currency[]): Currency  | undefined => {
    if(code && currencies)
    return currencies?.find(c => c.code === code.toUpperCase());
}

export const getQuoteCurrencyCodesOf = (baseCurrency: string, instruments: SpotInstrument[]): string[] => {
    return getCurrencyCodesOf(baseCurrency, instruments, false);
};

export const getBaseCurrencyCodesOf = (quoteCurrency: string, instruments: SpotInstrument[]): string[] => {
    return getCurrencyCodesOf(quoteCurrency, instruments, true);
};

export const getBaseCurrencyCodes = (instruments: SpotInstrument[]): string[] => {
    return Array.from(new Set(instruments?.map(i => i.baseCurrencyCode).sort()));
};

const getCurrencyCodesOf = (currency: string, instruments: SpotInstrument[], isBase: boolean): string[] => {
    if ((!currency || currency.trim() === "") && !instruments) {
        return [];
    }

    if (!currency || currency.trim() === "") {
        return isBase ? Array.from(new Set(instruments.map(i => i.baseCurrencyCode).sort())) : Array.from(new Set(instruments.map(i => i.quoteCurrencyCode).sort()));
    }

    return isBase
        ? Array.from(new Set(instruments?.filter(i => i.quoteCurrencyCode === currency).map(i => i.baseCurrencyCode).sort()))
        : Array.from(new Set(instruments?.filter(i => i.baseCurrencyCode === currency).map(i => i.quoteCurrencyCode).sort()));
};