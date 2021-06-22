import {combineReducers} from "@reduxjs/toolkit";
import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import appReducer from "./app/appSlice";
import bookkeeperReducer from "./bookkeeper/bookkeeper";

const appPersistConfig = {
    key: 'app',
    storage: storage,
};

const bookkeeperPersistConfig = {
    key: 'bookkeeper',
    storage: storage,
    whitelist: ['activeFundId'],
};

const rootSlice = combineReducers({
    app: persistReducer(appPersistConfig, appReducer),
    bookkeeper: persistReducer(bookkeeperPersistConfig, bookkeeperReducer),
});

export type RootState = ReturnType<typeof rootSlice>;

export default rootSlice;
