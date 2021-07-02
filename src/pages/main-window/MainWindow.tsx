import {useChannelProvider} from "openfin-react-hooks";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import React, {useEffect, useState} from "react";
import Prism from "prismjs";
import {
    clearClients,
} from "../../redux/slices/main-channel/mainChanelSlice";
import {Button, Grid, Typography} from "@material-ui/core";
import {createInitialWindows, mainWindowActions} from "./mainWindowActions";
import {closeChildWindows} from "../../common/utils";
import AuthService from "../../services/auth/AuthService";
import {setUser, setUserProfile} from "../../redux/slices/app/appSlice";
import {Identity} from "openfin/_v2/identity";

const CHANNEL_NAME = "test";

const MainWindow: React.FC = () => {
    const dispatch = useDispatch();
    const {childWindows, count, statuses} = useSelector((state: RootState) => state.mainChannel);
    const [localCount, setLocalCount] = useState<number>(0)
    const [numberOfChildWindows, setNumberOfChildWindows] = useState(0)

    const handleCloseAll = () => {
        const application = fin.desktop.Application.getCurrent();
        closeChildWindows(application)
        dispatch(clearClients())
        setNumberOfChildWindows(0)
    }

    const createChildWindows = async () => {
        let nrOfChildWindows = numberOfChildWindows
        const app = await fin.Application.getCurrent();

        let mainWindow = await fin.Window.getCurrent()
        if (numberOfChildWindows < 3)
            for (let i = 0; i < 3; i++) {
                createInitialWindows(nrOfChildWindows, dispatch, setNumberOfChildWindows).then(async () => {
                    let child = await app.getChildWindows()
                    if (child)
                        child[i].joinGroup(mainWindow)
                })
                nrOfChildWindows++
                setNumberOfChildWindows(nrOfChildWindows)
            }
        else {
            const application = fin.desktop.Application.getCurrent();
            closeChildWindows(application)
        }
    }

    const handleSignout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: boolean) => {
        e.preventDefault();
        if (value === true) {
            closeChildWindows(childWindows)
            dispatch(setUser(null))
            dispatch(setUserProfile(null))
            await AuthService.removeUser()
            await AuthService.startSignoutMainWindow();
            return;
        }
    };

    const { provider } = useChannelProvider(CHANNEL_NAME, mainWindowActions(dispatch));

    useEffect(() => {
        debugger
        if (provider) {
            provider.onConnection((identity: Identity) => {
                dispatch({ type: "onConnection", payload: { identity } });
            });
            provider.onDisconnection((identity: Identity) => {
                dispatch({ type: "onDisconnection", payload: { identity } });
            });
        }
        Prism.highlightAll();
    }, [provider, dispatch]);

    useEffect(() => {
        if (count) {
            setLocalCount(count)
        }
    }, [count])

    return (
        <Grid container>
            <Grid item>
                {statuses && statuses.map((c, key) => (
                    <div key={key}>
                        <Typography variant={"body2"}>{key + ' - ' + c.msg}</Typography>
                        <Button
                            variant={"outlined"}
                            size={"small"} onClick={() => console.log(c.name, dispatch)}>close</Button>
                    </div>
                ))}
            </Grid>
            <Grid item>
                <Button
                    variant={"outlined"}
                    size={"small"}
                    onClick={(e) => handleSignout(e, true)}
                >
                    Sign out
                </Button>
            </Grid>
            <Grid container>
                <Grid item>
                    <Button
                        variant={"outlined"}
                        size={"small"} onClick={() => createChildWindows()}>Create Child Windows</Button>
                </Grid>
                <Grid item>
                    <Button
                        variant={"outlined"}
                        size={"small"} onClick={() => handleCloseAll()}>Close All Child</Button>
                </Grid>
            </Grid>
            <Grid container>
                <strong>Count:</strong> {localCount}
            </Grid>
        </Grid>
    );
}

export default MainWindow;