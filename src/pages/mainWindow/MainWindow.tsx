import {Grid, Typography} from "@material-ui/core";
import {WindowOption} from "openfin/_v2/api/window/windowOption";
import {v4 as uuidv4} from "uuid";
import Ticker from "../childWindow/Ticker";
import {IUseChildWindowOptions, useChildWindow} from "openfin-react-hooks";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import {darkTheme as theme} from "../../themes";


const HTML_URL: string | undefined = process.env.REACT_APP_SAMPLE_WINDOW_HTML;

const MainWindow = () => {
    const {isAppReady, user} = useSelector((state: RootState) => state.app);

    const WINDOW_OPTIONS: WindowOption = {
        name: `WINDOW_NAME + ${uuidv4()}`,
        url: HTML_URL,
    }

    const CHILD_BODY_AS_HOOK_OPTION = (
        <Ticker/>
    );

    useEffect(() => {
        if (isAppReady) {
            console.log(isAppReady)
            console.log(user)
        }
    }, [isAppReady, user])

    const CHILD_WINDOW_HOOK_OPTIONS: IUseChildWindowOptions = {
        jsx: CHILD_BODY_AS_HOOK_OPTION,
        name: 'Child',
        shouldInheritCss: true,
        shouldInheritScripts: true,
        parentDocument: document,
        windowOptions: WINDOW_OPTIONS,
    };

    const childWindow = useChildWindow(CHILD_WINDOW_HOOK_OPTIONS);

    return (
        <>
            <Typography variant={"h4"}>Main Window</Typography>
            <Grid container>
                <Grid item>
                    <button onClick={() => childWindow.launch(WINDOW_OPTIONS)}>Launch new Window</button>
                </Grid>
            </Grid>
        </>
    )
}

export default MainWindow;