import {
    AppBar,
    createStyles,
    Grid,
    IconButton,
    makeStyles,
    Theme,
    Tooltip,
    Typography,
    useTheme
} from "@material-ui/core";
import BrightnessHighIcon from "@material-ui/icons/BrightnessHigh";
import clsx from "clsx";
import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setIsDarkTheme} from "../../redux/slices/app/appSlice";
import {RootState} from "../../redux/slices/rootSlice";
import MinimizeIcon from '@material-ui/icons/Minimize';
import CloseIcon from '@material-ui/icons/Close';
import LinkIcon from '@material-ui/icons/Link';
import {useLocation} from "react-use";
import {useMaximized} from "openfin-react-hooks";
import {FullscreenSharp} from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: {
            paddingRight: 5,
            height: '2em',
            minHeight: '2em',
        },
        appBar: {
            backgroundColor: theme.palette.background.default,
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            height: '2em',
            maxHeight: '2em'
        },
        title: {
            '-webkit-app-region': 'drag',
            flexGrow: 1,
            cursor: "pointer"
        },
        appBarSpacer: {
            height: '2em',
            minHeight: '2em',
            border: '1px solid black'
        }
    })
);

const Topbar = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme()
    const location = useLocation()
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const topbarTitle = useSelector((state: RootState) => state.app.topbarTitle);

    const [maximized, setMaximized] = useMaximized();

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
        const currentWindow = fin.desktop.Window.getCurrent()
        currentWindow.leaveGroup()
    }, []);


    const onMaximizeClick = () => {
        const currentWindow = fin.desktop.Window.getCurrent()
        if(maximized){
            setMaximized(false)
        }
        else{
            currentWindow.maximize()
        }
    }

    return (
        <AppBar position="absolute" className={clsx(classes.appBar, "appBar")}>
            <Grid container alignItems={"center"} style={{height: '15vh'}}>
                <div className={classes.title}>
                    <Typography variant="h5" color="inherit" noWrap style={{color: location.pathname === '/' ? theme.palette.text.primary : theme.palette.background.default}}>
                        {topbarTitle?.title}
                    </Typography>
                </div>
                <IconButton aria-label="Light/Dark" color="inherit" onClick={handleThemeChange}>
                    <Tooltip title="Toggle light/dark theme" aria-label="Light/Dark">
                        <BrightnessHighIcon style={{color: theme.palette.text.secondary}}/>
                    </Tooltip>
                </IconButton>
                <IconButton
                    className="header-icon link-icon"
                    onClick={onUndockClick}
                    title="Undock"
                >
                    <LinkIcon style={{color: theme.palette.text.secondary}}/>
                </IconButton>
                <IconButton className="header-icon" onClick={onMinimizeClick} title="Minimize">
                    <MinimizeIcon style={{color: theme.palette.text.secondary}}/>
                </IconButton>
                <IconButton className="header-icon" onClick={() => onMaximizeClick()} title="Maximize">
                    <FullscreenSharp style={{color: theme.palette.text.secondary}}/>
                </IconButton>
                <IconButton className="header-icon" onClick={onCloseClick} title="Close">
                    <CloseIcon style={{color: theme.palette.text.secondary}}/>
                </IconButton>
            </Grid>
        </AppBar>
    );
};

export default Topbar;
