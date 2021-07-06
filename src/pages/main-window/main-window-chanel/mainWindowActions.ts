import {
    addClientToList,
    close,
    decrement,
    increment,
    setWindow
} from "../../../redux/slices/main-channel/mainChanelSlice";
import {IChannelAction} from "openfin-react-hooks";
import {Dispatch} from "react";
import {
    getMarketDataWindowConfig,
    getNewFeedWindowConfig,
    getOtcTradingWindowConfig
} from "../../../window-configs/WindowConfig";

export const createInitialWindows = async (mainWindowPositions: any, numberOfChildWindows: number, dispatch: (any: any) => any, setNumberOfChildWindows: (any: any) => any) => {
    debugger
    switch (numberOfChildWindows) {
        case 0 : {
            const newWindow = await window.fin.Window.create(getMarketDataWindowConfig(mainWindowPositions.bottom, mainWindowPositions.left, 900,500));
            dispatch(setWindow(newWindow));
            setNumberOfChildWindows(numberOfChildWindows + 1)
            break;
        }
        case 1 : {
            const newWindow = await window.fin.Window.create(getOtcTradingWindowConfig(mainWindowPositions.bottom, mainWindowPositions.left +900, 500, 500));
            dispatch(setWindow(newWindow));
            setNumberOfChildWindows(numberOfChildWindows + 1)
            break;
        }
        case 2 : {
            const newWindow = await window.fin.Window.create(getNewFeedWindowConfig(mainWindowPositions.bottom +500, mainWindowPositions.left, 1400, 200));
            dispatch(setWindow(newWindow));
            setNumberOfChildWindows(numberOfChildWindows + 1)
            break;
        }
    }
};

export const mainWindowActions = (dispatch: Dispatch<any>): IChannelAction[] => [
    {
        action: () => dispatch(increment()),
        topic: "increment",
    },
    {
        action: () => dispatch(decrement()),
        topic: "decrement",
    },
    {
        action: (payload: any) => dispatch(addClientToList(payload)),
        topic: "addClientToList",
    },
    {
        action: (payload: any) => dispatch(close(payload)),
        topic: "close",
    }
];


