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
import {useDocked, useMaximized} from "openfin-react-hooks";
import {FullscreenSharp} from "@material-ui/icons";
import StockTicker from "../main-window/StockTickerContainer";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: {
            paddingRight: 5,
            minHeight: '4em',
            maxHeight: '4em'
        },
        appBar: {
            backgroundColor: theme.palette.background.default,
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            maxHeight: '4em'
        },
        title: {
            '-webkit-app-region': 'drag',
            flexGrow: 1,
            cursor: "pointer"
        },
        appBarSpacer: {
            minHeight: '4em',
            maxHeight: '4em',
            border: '1px solid black'
        },

    })
);

const Topbar = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme()
    const location = useLocation()
    const {isDarkTheme, profile} = useSelector((state: RootState) => state.app);
    const [maximized, setMaximized] = useMaximized();
    const [isDocked, undock] = useDocked();

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

    const onMaximizeClick = () => {
        const currentWindow = fin.desktop.Window.getCurrent()
        if (maximized) {
            setMaximized(false)
        } else {
            currentWindow.maximize()
        }
    }

    return (
        <AppBar position="absolute" className={clsx(classes.appBar, "appBar")}>
            <Grid container alignItems={"center"} style={{minHeight: '2em', maxHeight: '2em'}}>
                <div className={classes.title}>
                    <Typography variant="body1" color="inherit" noWrap
                                style={{color: location.pathname === '/' ? theme.palette.text.primary : theme.palette.background.default}}>
                        {"COVARIO"}
                    </Typography>
                </div>
                {location.pathname === '/' && <Grid item
                                                    style={{color: location.pathname === '/' ? theme.palette.text.primary : theme.palette.background.default}}>
                    {"Logged in as: " + profile?.name}
                </Grid>}
                <IconButton aria-label="Light/Dark" color="inherit" onClick={handleThemeChange}>
                    <Tooltip title="Toggle light/dark theme" aria-label="Light/Dark">
                        <BrightnessHighIcon style={{color: theme.palette.text.secondary}}/>
                    </Tooltip>
                </IconButton>
                {isDocked && <IconButton
                    className="header-icon link-icon"
                    onClick={undock}
                    title="Undock"
                >
                    <LinkIcon style={{color: theme.palette.text.secondary}}/>
                </IconButton>}
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
            <Grid container alignItems={"center"} style={{minHeight: '2em', maxHeight: '2em'}}>
                <StockTicker/>
            </Grid>
        </AppBar>
    );
};

export default React.memo(Topbar);
