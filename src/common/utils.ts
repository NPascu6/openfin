import {v4 as uuidv4} from "uuid";
import {close} from "../redux/slices/chanel/chanelSlice";
import {Dispatch} from "react";

export const getWindowConfig1 = (top: number, left: number, width: number, height: number) => {
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
        url: "/child-window",
    }
}

export const getWindowConfig2 = (top: number, left: number, width: number, height: number) => {
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
        url: "/dashboard",
    }
}

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