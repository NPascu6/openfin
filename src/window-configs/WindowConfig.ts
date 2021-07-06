import {v4 as uuidv4} from "uuid";

export const getMarketDataWindowConfig = (top: number, left: number, width: number, height: number) => {
    return {
        autoShow: true,
        defaultHeight: height,
        defaultTop: top,
        defaultLeft: left,
        defaultWidth: width,
        minWidth: 475,
        frame: false,
        name: uuidv4(),
        shouldLoadJsxAfterLaunch: true,
        waitForPageLoad: true,
        shouldClosePreviousOnLaunch: true,
        url: "/market-data-window",
    }
}

export const getOtcTradingWindowConfig = (top: number, left: number, width: number, height: number) => {
    return {
        autoShow: true,
        defaultHeight: height,
        defaultTop: top,
        defaultLeft: left,
        defaultWidth: width,
        minWidth: 275,
        frame: false,
        name: uuidv4(),
        shouldLoadJsxAfterLaunch: true,
        waitForPageLoad: true,
        shouldClosePreviousOnLaunch: true,
        url: "/otc-trading-window",
    }
}


export const getNewFeedWindowConfig = (top: number, left: number, width: number, height: number) => {
    return {
        autoShow: true,
        defaultHeight: height,
        defaultTop: top,
        defaultLeft: left,
        defaultWidth: width,
        minWidth: 450,
        frame: false,
        name: uuidv4(),
        shouldLoadJsxAfterLaunch: true,
        waitForPageLoad: true,
        shouldClosePreviousOnLaunch: true,
        url: "/news-feed-window",
    }
}