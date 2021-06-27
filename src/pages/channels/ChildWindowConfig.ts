import {WindowOption} from "openfin/_v2/api/window/windowOption";
import {IUseChildWindowOptions} from "openfin-react-hooks";
import {CHILD_BODY_AS_HOOK_OPTION} from "./ChildWindowBodyExample";

const WINDOW_HEIGHT: number = 200;

export const initialLaunchConfig = () => {
    return {
        htmlUrl: '/child-window',
        shouldClosePreviousOnLaunch: true,
        shouldInheritCss: true,
        shouldInheritScripts: true,
        shouldLoadJsxAfterLaunch: true,
        windowName: 'test',
    }
}

export const WINDOW_OPTIONS: WindowOption = {
    minHeight: WINDOW_HEIGHT,
    name: initialLaunchConfig().windowName,
    url: initialLaunchConfig().htmlUrl,
    waitForPageLoad: true,
};

export const CHILD_WINDOW_HOOK_OPTIONS: IUseChildWindowOptions = () => {
    return {
        jsx: CHILD_BODY_AS_HOOK_OPTION(),
        name: initialLaunchConfig().windowName,
        parentDocument: document,
        shouldClosePreviousOnLaunch: initialLaunchConfig().shouldClosePreviousOnLaunch,
        windowOptions: WINDOW_OPTIONS,
    }
};