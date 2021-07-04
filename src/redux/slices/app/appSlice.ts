import {Color} from "@material-ui/lab";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Profile, User} from "oidc-client";

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
    isSignoutOpen: boolean;
    navLinkState: any;
    locale: string;
    profile?: Profile | null;
    notification?: Notification
    user?: User | null;
    settingsOpen?: any
}

const initialState: MainState = {
    topbarTitle: {title: ""},
    isAppReady: false,
    isDarkTheme: false,
    isSignoutOpen: false,
    navLinkState: {},
    locale: "en-US"
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User | null | undefined>) {
            state.user = action.payload
        },
        setIsDarkTheme(state, action: PayloadAction<boolean>) {
            state.isDarkTheme = action.payload;
        },
        setIsAppReady(state, action: PayloadAction<boolean>) {
            state.isAppReady = action.payload;
        },
        setLocale(state, action: PayloadAction<string>) {
            state.locale = action.payload;
        },
        setUserProfile(state, action: PayloadAction<Profile | null>) {
            state.profile = action.payload;
        },
        setSettingsOpen(state, action: PayloadAction<any>){
            state.settingsOpen = action.payload
        },
    },
});

export const {
    setUser,
    setIsDarkTheme,
    setIsAppReady,
    setLocale,
    setUserProfile,
    setSettingsOpen
} = appSlice.actions;

export default appSlice.reducer;
