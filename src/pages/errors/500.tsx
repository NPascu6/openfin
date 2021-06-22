import {CssBaseline, Typography} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            height: "100vh",
            overflow: "auto",
            textAlign: "center",
            backgroundColor: theme.palette.background.default
        },
        message: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        },
    })
);

const ErrorPage = () => {
    const classes = useStyles();
    const userEmail = useSelector((state: RootState) => state.app.profile?.email);
    return (
        <div className={clsx(classes.root)}>
            <CssBaseline/>
            <div className={clsx(classes.message)}>
                <div className="logo logo-color" style={{height: "36px", marginBottom: "24px"}}/>
                <Typography variant="h5" gutterBottom>
                    Oops, something is wrong at our end
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Please contact us - <span style={{textDecoration: "underline"}}>support&#64;covar.io</span>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Your account test - <b>{userEmail}</b>
                </Typography>
            </div>
        </div>
    );
};

export default ErrorPage;
