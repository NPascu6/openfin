import {AppBar, createStyles, IconButton, makeStyles, Theme, Toolbar, Tooltip, Typography} from "@material-ui/core";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import BrightnessHighIcon from "@material-ui/icons/BrightnessHigh";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {setIsDarkTheme, setIsSideBarOpen} from "../../redux/slices/app/appSlice";
import {RootState} from "../../redux/slices/rootSlice";
import DashboardIcon from '@material-ui/icons/Dashboard';
import {Link} from "react-router-dom";
import AccountBoxIcon from "@material-ui/icons/AccountBox";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: {
            paddingRight: 5
        },
        appBar: {
            backgroundColor: theme.palette.primary.dark,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 90 90'%3E%3Ccircle fill-opacity='0.29' fill='%23ffffff' cx='45' cy='45' r='8'/%3E%3Cg fill='%23800' fill-opacity='0.29'%3E%3Ccircle cx='0' cy='90' r='61'/%3E%3Ccircle cx='90' cy='90' r='61'/%3E%3Ccircle cx='90' cy='0' r='61'/%3E%3Ccircle cx='0' cy='0' r='61'/%3E%3C/g%3E%3C/svg%3E\")",
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        menuButtonHidden: {
            display: "none",
        },
        title: {
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
    const isDrawerOpen = useSelector((state: RootState) => state.app.isSideBarOpen);
    const topbarTitle = useSelector((state: RootState) => state.app.topbarTitle);

    const handleDrawerOpen = () => {
        dispatch(setIsSideBarOpen(true));
    };

    const handleThemeChange = () => {
        const state = !isDarkTheme;
        dispatch(setIsDarkTheme(state));
    };

    return (
        <AppBar position="absolute" className={clsx(classes.appBar, "appBar")}>
            <Toolbar className={classes.toolbar}>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    className={clsx(classes.menuButton, isDrawerOpen && classes.menuButtonHidden)}
                >
                    <MenuIcon/>
                </IconButton>
                <div className={classes.title} onClick={handleDrawerOpen}>
                    <Typography variant="h5" color="inherit" noWrap>
                        {topbarTitle?.title}
                    </Typography>
                    {topbarTitle?.subTitle &&
                    <Typography variant="subtitle2" color="inherit" noWrap>
                        {topbarTitle.subTitle}
                    </Typography>
                    }
                </div>
                {topbarTitle?.title === 'Firm Management' &&
                <IconButton style={{marginRight: '0.5em'}} color="inherit" component={Link}
                            to={'/bookkeeping/management/onboarding'}>
                    <Typography style={{marginRight: '0.5em'}} variant={"body2"}>On-board Client</Typography>
                    <Tooltip title="Dashboard" aria-label="Dashboard">
                        <AccountBoxIcon/>
                    </Tooltip>
                </IconButton>}
                <IconButton color="inherit" component={Link} to={'/'}>
                    <Tooltip title="Dashboard" aria-label="Dashboard">
                        <DashboardIcon/>
                    </Tooltip>
                </IconButton>
                <IconButton aria-label="Light/Dark" color="inherit" onClick={handleThemeChange}>
                    <Tooltip title="Toggle light/dark theme" aria-label="Light/Dark">
                        {isDarkTheme ? <BrightnessHighIcon/> : <Brightness4Icon/>}
                    </Tooltip>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;
