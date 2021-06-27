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
        type: "",
        active: false,
    };
};

export const getQuoteCurrenciesOf = (baseCurrency: string, instruments: SpotInstrument[]): string[] => {
    return getCurrenciesOf(baseCurrency, instruments, false);
};

export const getBaseCurrenciesOf = (quoteCurrency: string, instruments: SpotInstrument[]): string[] => {
    return getCurrenciesOf(quoteCurrency, instruments, true);
};

export const getBaseCurrencies = (instruments: SpotInstrument[]): string[] => {
    return Array.from(new Set(instruments?.map(i => i.baseCurrencyCode).sort()));
};

const getCurrenciesOf = (currency: string, instruments: SpotInstrument[], isBase: boolean): string[] => {
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