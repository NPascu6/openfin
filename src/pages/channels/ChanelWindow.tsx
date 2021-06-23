import {useChannelProvider} from "openfin-react-hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import {useEffect, useState} from "react";
import Prism from "prismjs";
import {Identity} from "openfin/_v2/identity";
import {v4 as uuidv4} from 'uuid';
import {
    close,
    decrement,
    increment,
    addClientToList,
    setWindow,
    clearClients, onConnection, onDisconnection
} from "../../redux/slices/chanel/chanelSlice";

const CHANNEL_NAME = "test";

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
        debugger
        dispatch(close(name))
    }

    return (
        <div>
            <div>
                {statuses && statuses.map((c, key) => (
                    <div key={key}>{key + ' - ' + c.msg}<button onClick={() => closeWindowRemote(c.name)}>close</button></div>
                ))}
                <strong>Provider Status:</strong>
            </div>
            <button onClick={() => dispatch(clearClients())}>Clear clients</button>
            <button onClick={() => createWindow()}>Connect Client</button>
            <div><strong>Count:</strong> {localCount}</div>
        </div>
    );
}

export default Component;