import {close} from "../redux/slices/main-channel/mainChanelSlice";
import {Dispatch} from "react";

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
        return [''];
    }

    return browserLocales.map((locale) => {
        const trimmedLocale = locale.trim();

        return opt.languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale;
    });
};


export const closeChildWindows = (application: { getChildWindows: (arg0: (children: any) => void) => void; }) => {
    application.getChildWindows(function (children) {
        children.forEach(function (childWindow: { close: () => void; }) {
            childWindow.close();
        });
    });
}


export const joinMainWindow = (application: { getChildWindows: (arg0: (children: any) => void) => void; }, mainWindow: any) => {
    application.getChildWindows(function (children) {
        children.forEach(function (childWindow: { joinGroup: (arg0: any) => void; }) {
            childWindow.joinGroup(mainWindow);
        });
    });
}

export const closeWindowRemote = (name: string, dispatch: Dispatch<any>) => {
    dispatch(close(name))
}

export const numberFormatter = new Intl.NumberFormat(getBrowserLocale(), {maximumFractionDigits: 6});
export const cryptoNumberFormatter = new Intl.NumberFormat(getBrowserLocale(), {maximumFractionDigits: 6});
export const fiatNumberFormatter = new Intl.NumberFormat(getBrowserLocale(), {
    maximumFractionDigits: 6,
    minimumFractionDigits: 2,
});