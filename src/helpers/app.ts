import {Md5} from "ts-md5";

const {REACT_APP_SITE_TITLE, REACT_APP_STAGE} = process.env;

export const MINIMUM_QTY_DISPLAY = 0.0000001;

export const isFiatCurrency = (currency: string)  : boolean => {
    const ccy = currency.toUpperCase();
    return ccy === "USD" || ccy === "EUR" || ccy === "GBP" || ccy === "CHF" || ccy === "CAD" || ccy === "CNY";
};

export const getUserAvatarUrl = (email: string, size: number = 32) : string => {
    const hash = Md5.hashStr(email);
    return `//0.gravatar.com/avatar/${hash}?s=${size}`;
};

export const getBrowserLocale = () : string => {
    const locales = getBrowserLocales();
    return locales[0];
}

export const getBrowserLocales = (options = {}) : string[] => {
    const defaultOptions = {
        languageCodeOnly: false,
    };

    const opt = {
        ...defaultOptions,
        ...options,
    };

    const browserLocales = navigator.languages === undefined ? [navigator.language] : navigator.languages;

    if (!browserLocales) {
        return [];
    }

    return browserLocales.map((locale) => {
        const trimmedLocale = locale.trim();

        return opt.languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale;
    });
};

export const setPageTitle = (title: string) : void=> {
    let fullTitle = `${REACT_APP_SITE_TITLE} :: ${title}`;
    if(REACT_APP_STAGE === "staging")
        fullTitle = `${fullTitle} - Staging`
    document.title = fullTitle
};

export const numberFormatter = new Intl.NumberFormat(getBrowserLocale(), {maximumFractionDigits: 6});
export const cryptoNumberFormatter = new Intl.NumberFormat(getBrowserLocale(), {maximumFractionDigits: 6});
export const fiatNumberFormatter = new Intl.NumberFormat(getBrowserLocale(), {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
});

export const amountFormatter = (amount: number, currency: string) : string => {
    if (isFiatCurrency(currency)) return fiatNumberFormatter.format(amount);
    return numberFormatter.format(amount);
};

export const isValueEmpty = (value: any) : boolean => {
    return value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
};

export const isAnyValueEmpty = (...args: any[]) : boolean => {
    const found = args.find(value => isValueEmpty(value));
    return found !== undefined;
};

const formatter1 = new Intl.NumberFormat(getBrowserLocale(), {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
});

const formatter2 = new Intl.NumberFormat(getBrowserLocale(), {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
});

const formatter3 = new Intl.NumberFormat(getBrowserLocale(), {
    maximumFractionDigits: 3,
    minimumFractionDigits: 3,
});

const formatter4 = new Intl.NumberFormat(getBrowserLocale(), {
    maximumFractionDigits: 4,
    minimumFractionDigits: 4,
});

const formatter5 = new Intl.NumberFormat(getBrowserLocale(), {
    maximumFractionDigits: 5,
    minimumFractionDigits: 5,
});

export const formatPrice = (value: number) => {
    value = +value;

    if(value === 0) {
        return "0";
    }

    if(value >= 1000){
        return formatter1.format(value);
    }

    if(value >= 100){
        return formatter2.format(value);
    }

    if(value >= 10){
        return formatter3.format(value);
    }

    if(value >= 1){
        return formatter4.format(value);
    }

    return formatter5.format(value);
};