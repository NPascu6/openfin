import {
    Avatar,
    Button,
    Collapse,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Drawer,
    Grid,
    IconButton,
    lighten,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    ListSubheader,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import {Profile} from "oidc-client";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {NavLink, withRouter} from "react-router-dom";
import {rootRouteDefinition, RouteDefinition} from "../../router/Routes";
import AuthService from "../../services/auth/AuthService";
import {setIsSideBarOpen, setIsSignoutOpen, setNavLinkState} from "../../redux/slices/app/appSlice";
import {RootState} from "../../redux/slices/rootSlice";

const {REACT_APP_VERSION, REACT_APP_STAGE} = process.env;

const drawerWidth = 300;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        logo: {
            height: "1em",
            margin: "1em .5em",
            textAlign: "right",
            backgroundPosition: "left",
            backgroundOrigin: "content-box",
            padding: 1
        },
        drawerPaper: {
            position: "relative",
            whiteSpace: "nowrap",
            flex: 1,
            width: drawerWidth,
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerPaperClose: {
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up("sm")]: {
                width: theme.spacing(8),
            },
        },
        drawerLink: {
            textDecoration: "none",
            color: theme.palette.text.primary,
        },
        drawerSubLink: {
            paddingLeft: theme.spacing(6),
        },
        drawerButton: {
            "&:hover": {
                borderRight: `5px solid ${lighten(theme.palette.secondary.main, 0.3)}`,
            }
        },
        drawerButtonActive: {
            borderRight: `5px solid ${theme.palette.secondary.main}`,
        },
        avatar: {
            marginRight: theme.spacing(1),
            width: 48,
            height: 48,
        },
    })
);

const SignoutDialog = () => {
    const isSignoutOpen = useSelector((state: RootState) => state.app.isSignoutOpen);
    const dispatch = useDispatch();

    const handleSignout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: boolean) => {
        e.preventDefault();
        if (value === true) {
            await AuthService.startSignoutMainWindow();
            return;
        }
        else{

        }


        dispatch(setIsSignoutOpen(false));
    };

    return (<Dialog
        open={isSignoutOpen}
        keepMounted
        onClose={(e: any) => handleSignout(e, false)}
        aria-labelledby="alert-dialog-signout-title"
        aria-describedby="alert-dialog-signout-description"
    >
        <DialogTitle id="alert-dialog-signout-title">{"Sign out?"}</DialogTitle>

        <DialogContent dividers>
            <Typography variant="subtitle1">
                Do you want to sign out the portal?
            </Typography>
            <Typography variant="caption">
                If you click <b>Yes</b>, your session will end immediately.
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button variant="contained" color="secondary"
                    onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleSignout(e, false)}
                    autoFocus tabIndex={0}>
                No
            </Button>
            <Button variant="contained" color="default"
                    onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleSignout(e, true)}>
                Yes
            </Button>
        </DialogActions>
    </Dialog>)
};

const ProfileSection = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const profile = useSelector((state: RootState) => state.app.profile);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const toggleProfileMenu = () => {
        setProfileMenuOpen(!profileMenuOpen);
    };
    const handleProfile = () => {
        window.open("https://account.covar.io/Manage");
    };
    const showSignoutConfirmation = () => {
        dispatch(setIsSideBarOpen(false));
        dispatch(setIsSignoutOpen(true));
    };

    return (
        <List disablePadding>
            <ListItem button onClick={toggleProfileMenu}>
                <ListItemAvatar>
                    <Avatar className={classes.avatar} alt={profile ? profile.name : 'error'}/>
                </ListItemAvatar>
                <ListItemText primary={profile ? profile.name : 'error'} secondary={profile ? profile.email : 'error'}/>
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="toggle" onClick={toggleProfileMenu}>
                        {profileMenuOpen ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            <Collapse in={profileMenuOpen}>
                <Divider/>
                <List key="profile-menu" subheader={<ListSubheader>My account</ListSubheader>}>
                    <ListItem button onClick={handleProfile} className={classes.drawerButton}>
                        <ListItemIcon>
                            <AccountCircleIcon/>
                        </ListItemIcon>
                        <ListItemText primary="My Profile"/>
                    </ListItem>
                    <ListItem button onClick={showSignoutConfirmation} className={classes.drawerButton}>
                        <ListItemIcon>
                            <ExitToAppIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Sign Out"/>
                    </ListItem>
                </List>
            </Collapse>
        </List>
    )
};

const NavLinkSection = ({props}: { props: any }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const profile = useSelector((state: RootState) => state.app.profile);
    const navLinkState = useSelector((state: RootState) => state.app.navLinkState);

    const isActiveRoute = (routeName: any) => {
        return props.location.pathname === routeName;
    };

    const handleNavLinkExpand = (path: string) => {
        dispatch(setNavLinkState(path));
    };

    const handleClick = () => {
        dispatch(setIsSideBarOpen(false));
    };

    const renderNavLinks = (profile: Profile, routes: RouteDefinition [] | undefined, isSubLink: boolean = false) => {
        if (routes)
            return routes.map((route, index) => {
                if (!route.children) {
                    return (
                        <List key={`${index}-${route.path}`} component="div" disablePadding>
                            <NavLink to={route.path} className={clsx(classes.drawerLink)}>
                                <ListItem
                                    button
                                    selected={isActiveRoute(route.path)}
                                    onClick={handleClick}
                                    className={clsx(isActiveRoute(route.path)
                                        ? classes.drawerButton : "", isSubLink ? classes.drawerSubLink : "")}
                                >
                                    <ListItemIcon>
                                        <route.icon/>
                                    </ListItemIcon>
                                    <ListItemText primary={route.name}/>
                                </ListItem>
                            </NavLink>
                        </List>
                    )
                }
                return (
                    <List key={`${index}-${route.path}`} disablePadding>
                        {
                            !route.icon ?
                                <ListItem>
                                    <ListItemText>{route.name}</ListItemText>
                                </ListItem> :
                                <ListItem
                                    button
                                    onClick={() => handleNavLinkExpand(route.path)}>
                                    {
                                        route.icon && <ListItemIcon>
                                            <route.icon/>
                                        </ListItemIcon>
                                    }
                                    {
                                        route.icon ? <ListItemText primary={route.name}/> :
                                            <ListItemText>{route.name}</ListItemText>
                                    }
                                    {
                                        !route.icon ? null : navLinkState[route.path] ? <ExpandLess/> : <ExpandMore/>
                                    }
                                </ListItem>
                        }
                        {
                            !route.icon ? <Collapse
                                    in={true}
                                    timeout="auto"
                                    unmountOnExit>
                                    {
                                        renderNavLinks(profile, route.children, true)
                                    }
                                </Collapse> :
                                <Collapse
                                    in={navLinkState[route.path]}
                                    timeout="auto"
                                    unmountOnExit>
                                    {
                                        renderNavLinks(profile, route.children, true)
                                    }
                                </Collapse>
                        }
                    </List>
                )
            })
    };

    return (<>
        {profile && renderNavLinks(profile, rootRouteDefinition.children)}
    </>);
}

const VersionInfo = () => {
    const classes = useStyles();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const logoColour = `logo-${isDarkTheme ? "white" : "color"}`;
    let version = `v${REACT_APP_VERSION}`;
    if (REACT_APP_STAGE === "staging") {
        version = `${REACT_APP_STAGE} :: ${version}`
    }
    return (<div className={clsx("logo", logoColour, classes.logo)}>{version}</div>)
};

const Sidebar = (props: any) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const isSidebarOpen = useSelector((state: RootState) => state.app.isSideBarOpen);
    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === "keydown" &&
            ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
        ) {
            return;
        }

        dispatch(setIsSideBarOpen(open));
    };

    return (
        <>
            <Drawer
                classes={{
                    paper: clsx(classes.drawerPaper, !isSidebarOpen && classes.drawerPaperClose),
                }}
                open={isSidebarOpen}
                onClose={toggleDrawer(false)}
            >
                <Grid container direction="column" style={{flex: 1}}>
                    <ProfileSection/>
                    <Divider/>
                    <NavLinkSection props={props}/>
                    <Grid item style={{flex: 1}}/>
                    <Divider/>
                    <VersionInfo/>
                </Grid>
            </Drawer>
            <SignoutDialog/>
        </>
    );
};

export default withRouter(Sidebar);
