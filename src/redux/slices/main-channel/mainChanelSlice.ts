import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface MainState {
    name?: string;
    count: number;
    childWindows?: any;
    clients: any[],
    statuses: any [],
    mainProvider?: any
}

const initialState: MainState = {
    childWindows: [],
    count: 0,
    clients: [],
    statuses: [],
};

const channelSlice = createSlice({
    name: "mainChannel",
    initialState,
    reducers: {
        setWindow(state, action: PayloadAction<any>) {
            return {
                ...state,
                childWindows: {
                    [action.payload.identity.name]: action.payload,
                    ...state.childWindows,
                },
            };
        },
        setChildWindow(state, action: PayloadAction<any>) {
            return {
                ...state,
                childWindows: {
                    [action.payload.identity.name]: action.payload,
                    ...state.childWindows,
                },
            };
        },
        setChanelName(state, action: PayloadAction<string>) {
            state.name = action.payload
        },
        increment: function (state) {
            if (state.count !== undefined) {
                state.count = +state.count + 1
            }
        },
        decrement: function (state) {
            if (state.count !== undefined) {
                state.count = +state.count - 1
            }
        },
        onConnection: function (state,action: PayloadAction<any>) {
            const { statuses } = state;
            const { identity } = action.payload;
            return {
                ...state,
                statuses: statuses.concat({
                    msg: `Client connected: ${JSON.stringify(identity)}`,
                    name: identity.name,
                }),
            };
        },
        onDisconnection: function (state, action: PayloadAction<any>) {
            const { statuses } = state;
            const { identity } = action.payload;
            return {
                ...state,
                statuses: statuses.filter((x: { name: any }) => x.name !== identity.name),
            };
        },
        close: function (state, action: PayloadAction<any>) {
            const {windowName} = action.payload;

            if (windowName === undefined) {
                if (state.childWindows[action.payload]) {
                    state.childWindows[action.payload].close();
                }
            } else {
                if (state.childWindows[windowName]) {
                    state.childWindows[windowName].close();
                }
            }

            return state;
        },
        addClientToList(state, action: PayloadAction<any>) {
            state.clients.push(action.payload)
        },
        clearClients(state) {
            state.clients = []
            state.childWindows = []
        },
        setMainProvider(state, action: PayloadAction<any>) {
            state.mainProvider = action.payload
        },
    },
});

export const {
    setWindow,
    close,
    increment,
    decrement,
    setChanelName,
    addClientToList,
    clearClients,
    setChildWindow,
    onDisconnection,
    onConnection,
    setMainProvider
} = channelSlice.actions;

export default channelSlice.reducer;
