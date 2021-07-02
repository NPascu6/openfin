import {
    addClientToList,
    close,
    decrement,
    increment,
    setWindow
} from "../../redux/slices/main-channel/mainChanelSlice";
import {IChannelAction} from "openfin-react-hooks";
import {Dispatch} from "react";
import {getWindowConfig1} from "../../common/utils";

export const createInitialWindows = async (numberOfChildWindows: number, dispatch: (any: any) => any, setNumberOfChildWindows: (any: any) => any) => {
    switch (numberOfChildWindows) {
        case 0 : {
            const newWindow = await window.fin.Window.create(getWindowConfig1(450, 10, 1000, 400));
            dispatch(setWindow(newWindow));
            setNumberOfChildWindows(numberOfChildWindows + 1)
            break;
        }
        case 1 : {
            const newWindow = await window.fin.Window.create(getWindowConfig1(450, 1004, 1000, 400));
            dispatch(setWindow(newWindow));
            setNumberOfChildWindows(numberOfChildWindows + 1)
            break;
        }
        case 2 : {
            const newWindow = await window.fin.Window.create(getWindowConfig1(900, 10, 1400, 200));
            dispatch(setWindow(newWindow));
            setNumberOfChildWindows(numberOfChildWindows + 1)
            break;
        }
        default: {

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


