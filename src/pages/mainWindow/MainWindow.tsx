import {useChannelProvider} from "openfin-react-hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import React, {useEffect, useState} from "react";
import Prism from "prismjs";
import {Identity} from "openfin/_v2/identity";
import {clearClients, onConnection, onDisconnection, setPushMessage,} from "../../redux/slices/chanel/chanelSlice";
import {Typography} from "@material-ui/core";
import {createInitialWindows, mainWindowActions} from "./mainWindowActions";
import {closeChildWindows, closeWindowRemote, joinMainWindow} from "../../common/utils";
import {setIsSignoutOpen, setUser, setUserProfile} from "../../redux/slices/app/appSlice";
import AuthService from "../../services/auth/AuthService";
import {ChannelProvider} from "openfin/_v2/api/interappbus/channel/provider";
import {HubConnectionBuilder, JsonHubProtocol, LogLevel} from "@microsoft/signalr";

const CHANNEL_NAME = "test";

const MainWindow: React.FC = () => {
    const dispatch = useDispatch();
    const {isAppReady, user} = useSelector((state: RootState) => state.app);
    const {childWindows, count, statuses} = useSelector((state: RootState) => state.channel);
    const [localCount, setLocalCount] = useState(0)
    const [numberOfChildWindows, setNumberOfChildWindows] = useState(0)
    const [localProvider, setLocalProvider] = useState<ChannelProvider>()
    const {provider} = useChannelProvider(CHANNEL_NAME, mainWindowActions(dispatch));

    const handleCloseAll = () => {
        const application = fin.desktop.Application.getCurrent();
        closeChildWindows(application)
        dispatch(clearClients())
        setNumberOfChildWindows(0)
    }


    useEffect(() => {
        if (user) {
debugger

            const connection = new HubConnectionBuilder()
                .withUrl('https://api-test.covar.io/v1/marketdata/realtimeHub', { accessTokenFactory: () => `892efb5a-2984-3f13-34a2-72f3389e070d`})
                .withAutomaticReconnect()
                .withHubProtocol(new JsonHubProtocol())
                .configureLogging(LogLevel.Information)
                .build();

            connection.start()
                .then(result => {
                    console.log('Connected!');

                    connection.on('ReceiveMessage', message => {
                        console.log(message)
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }

    }, [user]);


    useEffect(() => {
        if (isAppReady && numberOfChildWindows < 3 && user) {
            createInitialWindows(numberOfChildWindows, dispatch, setNumberOfChildWindows)
        }
    }, [numberOfChildWindows, isAppReady, dispatch, user])

    useEffect(() => {
        if (provider) {
            provider.onConnection((identity: Identity) => {
                dispatch(onConnection(identity));
            });
            provider.onDisconnection((identity: Identity) => {
                dispatch(onDisconnection(identity));
            });
            setLocalProvider(provider)
        }
        Prism.highlightAll();
    }, [provider, dispatch]);

    useEffect(() => {
        if (Object.keys(childWindows).length > 0) {
            const application = fin.desktop.Application.getCurrent();
            const mainWindow = fin.desktop.Window.getCurrent()
            joinMainWindow(application, mainWindow)
        } else if (Object.keys(childWindows).length > 4) {
            const application = fin.desktop.Application.getCurrent();
            closeChildWindows(application)
        }
    }, [childWindows])

    useEffect(() => {
        if (count) {
            setLocalCount(count)
        }
    }, [count])

    const handleSignout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: boolean) => {
        e.preventDefault();

        dispatch(setUser(null))
        dispatch(setUserProfile(null))
        dispatch(setIsSignoutOpen(false));
        handleCloseAll()

        if (value === true) {
            await AuthService.startSignoutMainWindow();
            return;
        }
    };

    return (
        <div>
            {"Logged in as: " + user?.profile.name}
            <button onClick={(e) => handleSignout(e, true)}>Sign out</button>
            <input
                placeholder="Type your message"
                type="text"
                onChange={(e) =>
                    dispatch(setPushMessage(e.target.value))
                }
            />
            <button
                onClick={() => provider.publish("pushMessage", localProvider)}
                disabled={Object.keys(childWindows).length === 0}
            >
                Push
            </button>
            <div>
                {statuses && statuses.map((c, key) => (
                    <div key={key}>
                        <Typography variant={"body2"}>{key + ' - ' + c.msg}</Typography>
                        <button onClick={() => closeWindowRemote(c.name, dispatch)}>close</button>
                    </div>
                ))}
            </div>
            <button onClick={() => handleCloseAll()}>Reconnect clients</button>
            <button
                onClick={() => createInitialWindows(numberOfChildWindows, dispatch, setNumberOfChildWindows)}>Connect
                Client
            </button>
            <div><strong>Count:</strong> {localCount}</div>
        </div>
    );
}

export default MainWindow;