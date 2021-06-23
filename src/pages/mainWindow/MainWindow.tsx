import {Grid, Typography} from "@material-ui/core";
import React from "react";

const MainWindow = () => {
    return (
        <>
            <Typography variant={"h4"}>Main Window</Typography>
            <Grid container>
                <Grid item>
                    Main
                </Grid>
            </Grid>
        </>
    )
}

export default MainWindow;