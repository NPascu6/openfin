import {Grid, Typography} from "@material-ui/core";
import {WindowOption} from "openfin/_v2/api/window/windowOption";
import {v4 as uuidv4} from "uuid";
import Ticker from "../childWindow/Ticker";
import {IUseChildWindowOptions, useChildWindow} from "openfin-react-hooks";
import React from "react";

const HTML_URL: string | undefined = process.env.REACT_APP_SAMPLE_WINDOW_HTML;

const MainWindow = () => {
    const WINDOW_OPTIONS: WindowOption = {
        name: `WINDOW_NAME + ${uuidv4()}`,
        url: HTML_URL,
    }

    const CHILD_BODY_AS_HOOK_OPTION = (
        <div>
            <Ticker/>
        </div>
    );

    const CHILD_WINDOW_HOOK_OPTIONS: IUseChildWindowOptions = {
        jsx: CHILD_BODY_AS_HOOK_OPTION,
        name: 'Child',
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