import {combineReducers} from "@reduxjs/toolkit";
import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import appReducer from "./app/appSlice";
import mainChannelReducer from "./main-channel/mainChanelSlice";
import instrumentReducer from "./instrument/instrumentSlice";
import bookkeeperReducer from "./book-keeper/bookkeeperSlice";

const appPersistConfig = {
    key: 'app',
    storage: storage,
};

const channelPersistConfig = {
    key: 'mainChannelReducer',
    storage: storage,
};

const bookkeeperPersistConfig = {
    key: 'bookkeeper',
    storage: storage,
    whitelist: ['activeFundId'],
};

const rootSlice = combineReducers({
    app: persistReducer(appPersistConfig, appReducer),
    mainChannel: persistReducer(channelPersistConfig, mainChannelReducer),
    bookkeeper: persistReducer(bookkeeperPersistConfig, bookkeeperReducer),

    instrument: instrumentReducer,
});

export type RootState = ReturnType<typeof rootSlice>;

export default rootSlice;
