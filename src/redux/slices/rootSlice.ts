import {combineReducers} from "@reduxjs/toolkit";
import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import bookkeeperReducer from "./bookKeeper/bookkeeper";
import instrumentReducer from "./instruments/instrument";
import appReducer from "./app/appSlice";
import channelReducer from "./chanel/chanelSlice";
import marketdataReducer from "./marketdata/marketdata";
import otcReducer from "./otc/otc";

const appPersistConfig = {
    key: 'app',
    storage: storage,
};

const bookkeeperPersistConfig = {
    key: 'bookkeeper',
    storage: storage,
    whitelist: ['activeFundId'],
};

const channelPersistConfig = {
    key: 'channel',
    storage: storage,
};

const rootSlice = combineReducers({
    app: persistReducer(appPersistConfig, appReducer),
    channel: persistReducer(channelPersistConfig, channelReducer),
    bookkeeper: persistReducer(bookkeeperPersistConfig, bookkeeperReducer),
    instrument: instrumentReducer,
    marketdata: marketdataReducer,
    otc: otcReducer
});

export type RootState = ReturnType<typeof rootSlice>;

export default rootSlice;
