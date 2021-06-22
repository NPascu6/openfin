import {Button, CssBaseline, Typography} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/slices/rootSlice";
import AuthService from "../../services/auth/AuthService";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {Link} from "react-router-dom";

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

const ForbiddenPage: React.FC = () => {
    const classes = useStyles();
    const userEmail = useSelector((state: RootState) => state.app.profile?.email);

    const redirectToSigninPage = async () => {
        await AuthService.startSignoutMainWindow();
        return;
    }

    return (
        <div className={clsx(classes.root)}>
            <CssBaseline/>
            <div className={clsx(classes.message)}>
                <div className="logo logo-color" style={{height: "36px", marginBottom: "24px"}}/>
                <Typography variant="h5" gutterBottom>
                    Forbidden page.
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Please contact us - <span style={{textDecoration: "underline"}}>support&#64;covar.io</span>
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Your account - <b>{userEmail}</b>
                </Typography>
                <p style={{textAlign: "center"}}>
                    <Button variant="contained" aria-label={'Home'} color="primary" to="/" component={Link}>Go to
                        Home</Button>
                </p>
                <Typography variant="subtitle1" gutterBottom onClick={redirectToSigninPage}>
                    <b>Sign out.</b>
                    <ExitToAppIcon style={{cursor: 'pointer'}}/>
                </Typography>
            </div>
        </div>
    );
};

export default ForbiddenPage;
