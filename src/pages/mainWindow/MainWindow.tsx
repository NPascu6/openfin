import {useChannelProvider} from "openfin-react-hooks";
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
    onDisconnection,
    setWindow
} from "../../redux/slices/chanel/chanelSlice";

const CHANNEL_NAME = "test";

const createInitialWindows = async (numberOfChildWindows: number, dispatch: (any: any) => any, setNumberOfChildWindows: (any: any) => any) => {
    const getConfig = (top: number, left: number, width: number, height: number) => {
        return {
            autoShow: true,
            defaultHeight: height,
            defaultTop: top,
            defaultLeft: left,
            defaultWidth: width,
            minWidth: 370,
            frame: false,
            name: uuidv4(),
            url: "/child-window",
        }
    }

    switch (numberOfChildWindows) {
        case 0 : {
            const newWindow = await window.fin.Window.create(getConfig(255, 10, 995, 400));
            dispatch(setWindow(newWindow));
            setNumberOfChildWindows(numberOfChildWindows + 1)
            break;
        }
        case 1 : {
            const newWindow = await window.fin.Window.create(getConfig(255, 1015, 400, 400));
            dispatch(setWindow(newWindow));
            setNumberOfChildWindows(numberOfChildWindows + 1)
            break;
        }
        case 2 : {
            const newWindow = await window.fin.Window.create(getConfig(660, 10, 1400, 200));
            dispatch(setWindow(newWindow));
            setNumberOfChildWindows(numberOfChildWindows + 1)
            break;
        }
        default: {

        }
    }
};

const MainWindow = () => {
    const dispatch = useDispatch();
    const {isAppReady} = useSelector((state: RootState) => state.app);
    const {childWindows, count, statuses} = useSelector((state: RootState) => state.channel);
    const [localCount, setLocalCount] = useState(0)
    const [numberOfChildWindows, setNumberOfChildWindows] = useState(0)

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

    const closeWindowRemote = (name: string) => {
        dispatch(close(name))
    }

    const handleCloseAll = () => {
        const application = fin.desktop.Application.getCurrent();

        application.getChildWindows(function (children) {
            children.forEach(function (childWindow) {
                console.log("Showing child: " + childWindow.name);
                childWindow.close();
            });
        });
        dispatch(clearClients())
        setNumberOfChildWindows(0)
    }

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

    useEffect(() => {
        if (isAppReady && numberOfChildWindows < 3) {
            createInitialWindows(numberOfChildWindows, dispatch, setNumberOfChildWindows)
        }
    }, [numberOfChildWindows, isAppReady, dispatch])

    useEffect(() => {
        if (Object.keys(childWindows).length > 0) {
            const application = fin.desktop.Application.getCurrent();
            const mainWindow = fin.desktop.Window.getCurrent()

            application.getChildWindows(function (children) {
                children.forEach(function (childWindow) {
                    childWindow.joinGroup(mainWindow);
                });
            });
        } else if (Object.keys(childWindows).length > 4) {
            const application = fin.desktop.Application.getCurrent();

            application.getChildWindows(function (children) {
                children.forEach(function (childWindow) {
                    childWindow.close();
                });
            });
        }
    }, [childWindows])

    useEffect(() => {
        if (count) {
            setLocalCount(count)
        }
    }, [count])

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
            <button onClick={() => handleCloseAll()}>Clear clients</button>
            <button
                onClick={() => createInitialWindows(numberOfChildWindows, dispatch, setNumberOfChildWindows)}>Connect
                Client
            </button>
            <div><strong>Count:</strong> {localCount}</div>
        </div>
    );
}

export default MainWindow;