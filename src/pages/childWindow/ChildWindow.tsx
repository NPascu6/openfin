import {useChannelClient} from "openfin-react-hooks";
import Ticker from "../../components/common/Ticker";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import Topbar from "../../components/app/Topbar";
import {Grid} from "@material-ui/core";

const CHANNEL_NAME = "test";

const ChildWindow: React.FC = () => {
    const [, setLocalTicker] = useState(0)
    const {childWindows} = useSelector((state: RootState) => state.channel);
    const {client} = useChannelClient(CHANNEL_NAME);
    const [pushMsg, setPushMessage] = useState();

    useEffect(() => {
        const addClientToList = async () => {
            await client.dispatch("addClientToList", client)
        }

        if (client) {
            addClientToList()
        }
    }, [client])

    useEffect(() => {
        if (client) {
            client.register("pushMessage", (payload: any) => setPushMessage(payload));
        }
    }, [client]);

    return (
        <div>
            <Topbar/>
            <Ticker setLocalTicker={setLocalTicker}/>
            <Grid container>
                {pushMsg ? (
                    <div>
                        <strong>Push Received:</strong> <span>{pushMsg}</span>
                    </div>
                ) : null}
            </Grid>
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