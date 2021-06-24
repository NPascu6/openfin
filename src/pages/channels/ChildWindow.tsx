import {IUseChildWindowOptions, useChannelClient, useChildWindow} from "openfin-react-hooks";
import Ticker from "../childWindow/Ticker";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import {WindowOption} from "openfin/_v2/api/window/windowOption";
import {CHILD_BODY_AS_HOOK_OPTION} from "./ChildWindowBody";
import {setChildWindow} from "../../redux/slices/chanel/chanelSlice";
import ILaunchConfig from "openfin-react-hooks/demo/src/pages/childWindow/ILaunchConfig";

const CHANNEL_NAME = "test";

const WINDOW_HEIGHT: number = 200;
const HTML_URL: string | undefined = process.env.REACT_APP_SAMPLE_WINDOW_HTML;


const ChildWindow: React.FC = () => {
    const dispatch = useDispatch()
    const {client} = useChannelClient(CHANNEL_NAME);
    const [, setLocalTicker] = useState(0)
    const {childWindows} = useSelector((state: RootState) => state.channel);

    useEffect(() => {
        const addClientToList = async () => {
            await client.dispatch("addClientToList", client)
        }

        if (client) {
            addClientToList()
        }

    }, [client])

    const [launchConfig,] = useState<ILaunchConfig>({
        htmlUrl: HTML_URL,
        shouldClosePreviousOnLaunch: true,
        shouldInheritCss: true,
        shouldInheritScripts: true,
        shouldLoadJsxAfterLaunch: true,
        windowName: 'test',
    });

    const WINDOW_OPTIONS: WindowOption = {
        minHeight: WINDOW_HEIGHT,
        name: launchConfig.windowName,
        url: launchConfig.htmlUrl,
        waitForPageLoad: true,
    };

    const CHILD_WINDOW_HOOK_OPTIONS: IUseChildWindowOptions = {
        cssUrl: launchConfig.cssUrl,
        jsx: CHILD_BODY_AS_HOOK_OPTION(),
        name: launchConfig.windowName,
        parentDocument: document,
        shouldClosePreviousOnLaunch: launchConfig.shouldClosePreviousOnLaunch,
        windowOptions: WINDOW_OPTIONS,
    };

    const childWindow = useChildWindow(CHILD_WINDOW_HOOK_OPTIONS);

    const handleChildLaunch = () => {
        childWindow.launch()
    }

    useEffect(() => {
        if (childWindow.state === 'POPULATED') {
            dispatch(setChildWindow(childWindow.windowRef))
        }
    }, [dispatch, childWindow.state, childWindow.windowRef])

    return (
        <div>
            <Ticker setLocalTicker={setLocalTicker}/>
            <button onClick={() => handleChildLaunch()}>Launch</button>
            <button onClick={async () => await client.dispatch("increment")}>
                Increment
            </button>
            <button onClick={async () => await client.dispatch("decrement")}>
                Decrement
            </button>
            <button
                onClick={async () =>
                    await client.dispatch("close", {
                        windowName: window.fin.Window.getCurrentSync().identity.name,
                        childWindows
                    })
                }
            >
                Close
            </button>
        </div>
    );
};

export default ChildWindow;