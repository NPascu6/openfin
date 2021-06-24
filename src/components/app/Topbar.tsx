import {AppBar, createStyles, IconButton, makeStyles, Theme, Toolbar, Tooltip, Typography} from "@material-ui/core";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import BrightnessHighIcon from "@material-ui/icons/BrightnessHigh";
import clsx from "clsx";
import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setIsDarkTheme} from "../../redux/slices/app/appSlice";
import {RootState} from "../../redux/slices/rootSlice";
import MinimizeIcon from '@material-ui/icons/Minimize';
import CloseIcon from '@material-ui/icons/Close';
import LinkIcon from '@material-ui/icons/Link';
import {snapAndDock} from "openfin-layouts";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: {
            paddingRight: 5,
            height: '15vh',
            minHeight: '15vh',
        },
        appBar: {
            backgroundColor: theme.palette.background.default,
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            height: '15vh'
        },

        title: {
            '-webkit-app-region': 'drag',
            flexGrow: 1,
            cursor: "pointer",
        },
        appBarSpacer: theme.mixins.toolbar,
    })
);

const Topbar = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const topbarTitle = useSelector((state: RootState) => state.app.topbarTitle);

    const handleThemeChange = () => {
        dispatch(setIsDarkTheme(!isDarkTheme));
    };

    const onMinimizeClick = useCallback(async () => {
        const currentWindow = fin.desktop.Window.getCurrent()
        currentWindow.minimize();
    }, []);

    const onCloseClick = useCallback(async () => {
        const currentWindow = fin.desktop.Window.getCurrent()
        currentWindow.close();
    }, []);

    const onUndockClick = useCallback(async () => {
        await snapAndDock.undockWindow();
    }, []);

    return (
        <AppBar position="absolute" className={clsx(classes.appBar, "appBar")}>
            <Toolbar className={classes.toolbar}>
                <div className={classes.title}>
                    <Typography variant="h5" color="inherit" noWrap>
                        {topbarTitle?.title}
                    </Typography>
                </div>
                <IconButton aria-label="Light/Dark" color="inherit" onClick={handleThemeChange}>
                    <Tooltip title="Toggle light/dark theme" aria-label="Light/Dark">
                        {isDarkTheme ? <BrightnessHighIcon/> : <Brightness4Icon/>}
                    </Tooltip>
                </IconButton>
                <IconButton
                    className="header-icon link-icon"
                    onClick={onUndockClick}
                    title="Undock"
                >
                    <LinkIcon/>
                </IconButton>
                <IconButton className="header-icon" onClick={onMinimizeClick} title="Minimize">
                    <MinimizeIcon/>
                </IconButton>
                <IconButton className="header-icon" onClick={onCloseClick} title="Close">
                    <CloseIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;
