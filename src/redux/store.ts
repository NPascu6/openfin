import {Action, configureStore, getDefaultMiddleware, ThunkAction} from "@reduxjs/toolkit";
import {persistStore} from "redux-persist";
import rootSlice, {RootState} from "./slices/rootSlice";

export const store = configureStore({
    reducer: rootSlice,
    middleware: [
        ...getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }),
    ]
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
