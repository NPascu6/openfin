import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";

const {REACT_APP_STAGE} = process.env;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: "#9f2924"
        }
    })
);

const AppLoader = () => {
    const classes = useStyles();
    return (
        <div className={clsx("loading", classes.root)}>
            <div className="loading-header">
                <div className="loading-logo">
                    <span style={{flex: 1}}>&nbsp;</span>
                    <span className="loader">&nbsp;</span>
                </div>
                <div className="subTitle">Getting things ready for you</div>
                {REACT_APP_STAGE === "staging" ? (
                    <div className="subTitle">You are in staging environment</div>) : null}
            </div>
        </div>
    )
};

export default AppLoader;