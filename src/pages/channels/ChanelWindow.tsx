import {IUseChildWindowOptions, useChannelProvider, useChildWindow} from "openfin-react-hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import {useEffect, useState} from "react";
import Prism from "prismjs";
import {Identity} from "openfin/_v2/identity";
import {v4 as uuidv4} from 'uuid';
import {
    addClientToList,
    clearClients,
    close,
    decrement,
    increment,
    onConnection,
    onDisconnection, setChildWindow,
    setWindow
} from "../../redux/slices/chanel/chanelSlice";
import ILaunchConfig from "openfin-react-hooks/demo/src/pages/childWindow/ILaunchConfig";
import {WindowOption} from "openfin/_v2/api/window/windowOption";
import {CHILD_BODY_AS_HOOK_OPTION} from "./ChildWindowBody";

const CHANNEL_NAME = "test";
const WINDOW_HEIGHT: number = 200;
const HTML_URL: string | undefined = process.env.REACT_APP_SAMPLE_WINDOW_HTML;

const Component = () => {
    const dispatch = useDispatch();
    const {childWindows, count, statuses} = useSelector((state: RootState) => state.channel);
    const [localCount, setLocalCount] = useState(0)

    useEffect(() => {
        if (count) {
            setLocalCount(count)
        }
    }, [count])

    const channelActions = [
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
        },
    ];
    const {provider} = useChannelProvider(CHANNEL_NAME, channelActions);

    useEffect(() => {
        if (provider) {
            provider.onConnection((identity: Identity) => {
                dispatch(onConnection(identity));
            });
            provider.onDisconnection((identity: Identity) => {
                dispatch(onDisconnection(identity));
            });
        }
        Prism.highlightAll();
    }, [provider, dispatch]);

    const createWindow = async () => {
        const newWindow = await window.fin.Window.create({
            autoShow: true,
            defaultHeight: 420,
            defaultTop: 50 + Object.keys(childWindows).length * 20,
            defaultWidth: 680,
            frame: true,
            name: uuidv4(),
            url: "/channel-client",
        });

        dispatch(setWindow(newWindow));
    };

    const closeWindowRemote = (name: string) => {
        dispatch(close(name))
    }

    const [launchConfig,] = useState<ILaunchConfig>({
        htmlUrl: HTML_URL,
        shouldClosePreviousOnLaunch: true,
        shouldInheritCss: true,
        shouldInheritScripts: true,
        shouldLoadJsxAfterLaunch: true,
        windowName: 'test',
    });

    const WINDOW_OPTIONS: WindowOption = {
        maxHeight: WINDOW_HEIGHT,
        maxWidth: WINDOW_HEIGHT,
        minHeight: WINDOW_HEIGHT,
        minWidth: WINDOW_HEIGHT,
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

    useEffect(() => {
        if (childWindow.state === 'POPULATED') {
            dispatch(setChildWindow(childWindow.windowRef))
        }
    }, [dispatch, childWindow.state, childWindow.windowRef])


    const handleChildLaunch = () => {
        childWindow.launch()
    }

    return (
        <div>
            <div>
                {statuses && statuses.map((c, key) => (
                    <div key={key}>{key + ' - ' + c.msg}
                        <button onClick={() => closeWindowRemote(c.name)}>close</button>
                    </div>
                ))}
                <strong>Provider Status:</strong>
            </div>
            <button onClick={() => dispatch(clearClients())}>Clear clients</button>
            <button onClick={() => createWindow()}>Connect Client</button>
            <button onClick={() => handleChildLaunch()}>Launch</button>
            <div><strong>Count:</strong> {localCount}</div>
        </div>
    );
}

export default Component;