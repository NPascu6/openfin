import {Color} from "@material-ui/lab";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Profile} from "oidc-client";

const {REACT_APP_STAGE} = process.env;

export interface TopbarTitle {
    title: string;
    subTitle?: string
}

export interface Notification {
    title: string;
    message: string;
    severity: Color
}

export interface MainState {
    topbarTitle: TopbarTitle;
    isAppReady: boolean;
    isDarkTheme: boolean;
    isSideBarOpen: boolean;
    isSignoutOpen: boolean;
    navLinkState: any;
    locale: string;
    profile?: Profile;
    notification?: Notification
}

const initialState: MainState = {
    topbarTitle: {title: "Covario AG"},
    isAppReady: false,
    isDarkTheme: false,
    isSideBarOpen: false,
    isSignoutOpen: false,
    navLinkState: {},
    locale: "en-US"
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setIsDarkTheme(state, action: PayloadAction<boolean>) {
            state.isDarkTheme = action.payload;
        },
        setIsSignoutOpen(state, action: PayloadAction<boolean>) {
            state.isSignoutOpen = action.payload;
        },
        setIsSideBarOpen(state, action: PayloadAction<boolean>) {
            state.isSideBarOpen = action.payload;
        },
        setIsAppReady(state, action: PayloadAction<boolean>) {
            state.isAppReady = action.payload;
        },
        setTopbarTitle(state, action: PayloadAction<TopbarTitle>) {
            const titleState = action.payload;
            if (REACT_APP_STAGE === "staging") {
                titleState.subTitle = titleState.subTitle ? `Staging :: ${titleState.subTitle}` : "Staging environment"
            }
            state.topbarTitle = titleState;
        },
        setLocale(state, action: PayloadAction<string>) {
            state.locale = action.payload;
        },
        setUserProfile(state, action: PayloadAction<Profile>) {
            state.profile = action.payload;
        },
        setNavLinkState(state, action: PayloadAction<string>) {
            const prevState = state.navLinkState;
            const item = action.payload;
            state.navLinkState = {...prevState, [item]: !prevState[item]};
        },
        setNotification(state, action: PayloadAction<Notification>) {
            state.notification = action.payload;
        }
    },
});

export const {
    setIsDarkTheme,
    setTopbarTitle,
    setIsSideBarOpen,
    setIsSignoutOpen,
    setIsAppReady,
    setLocale,
    setUserProfile,
    setNavLinkState,
    setNotification
} = appSlice.actions;

export default appSlice.reducer;
