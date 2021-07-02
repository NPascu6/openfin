import {combineReducers} from "@reduxjs/toolkit";
import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import appReducer from "./app/appSlice";
import mainChannelReducer from "./main-channel/mainChanelSlice";

const appPersistConfig = {
    key: 'app',
    storage: storage,
};

const channelPersistConfig = {
    key: 'mainChannelReducer',
    storage: storage,
};

const rootSlice = combineReducers({
    app: persistReducer(appPersistConfig, appReducer),
    mainChannel: persistReducer(channelPersistConfig, mainChannelReducer),
});

export type RootState = ReturnType<typeof rootSlice>;

export default rootSlice;
