import {useChannelClient} from "openfin-react-hooks";
import Ticker from "../childWindow/Ticker";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";

const CHANNEL_NAME = "test";

const ChannelClient: React.FC = () => {
    const {client} = useChannelClient(CHANNEL_NAME);
    const [, setLocalTicker] = useState(0)
    const {childWindows} = useSelector((state: RootState) => state.channel);

    useEffect(() => {
        const addClientToList = async () => {
            await client.dispatch("addClientToList", client)
        }

        if (client) {
            console.log(childWindows)
            addClientToList()
        }

    }, [client, childWindows])

    return (
        <div>
            <Ticker setLocalTicker={setLocalTicker}/>
            <h2>Try it out</h2>
            <button onClick={async () => await client.dispatch("increment")}>
                Increment
            </button>
            {" "}
            <button onClick={async () => await client.dispatch("decrement")}>
                Decrement
            </button>
            {" "}
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

export default ChannelClient;