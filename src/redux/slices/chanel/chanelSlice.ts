import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface MainState {
    name?: string;
    count: number;
    statuses?: any[];
    childWindows?: any;
    pushMessage?: string;
    clients: any[]
}

const initialState: MainState = {
    childWindows: [],
    count: 0,
    statuses: [],
    pushMessage: '',
    clients: []
};

const channelSlice = createSlice({
    name: "channel",
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
        close: function (state, action: PayloadAction<any>) {
            const {windowName} = action.payload;

            if(windowName === undefined){
                if (state.childWindows[action.payload]) {
                    state.childWindows[action.payload].close();
                }
            }
            else{
                if (state.childWindows[windowName]) {
                    state.childWindows[windowName].close();
                }
            }

            return state;
        },
        onConnection: function (state, action: PayloadAction<any>) {
            const {statuses} = state;
            const identity = action.payload;
            if (statuses)
                return {
                    ...state,
                    statuses: statuses.concat({
                        msg: `Client connected: ${JSON.stringify(identity)}`,
                        name: identity.name,
                    }),
                };

        },
        onDisconnection(state, action: PayloadAction<any>) {
            const {statuses} = state;
            const identity = action.payload;
            if (statuses)
                return {
                    ...state,
                    statuses: statuses.filter((x: { name: any }) => x.name !== identity.name),
                };
        },
        addClientToList(state, action: PayloadAction<any>) {
            state.clients.push(action.payload)
        },
        clearClients(state) {
            state.clients = []
            state.statuses = []
            state.childWindows = []
        }
    },
});

export const {
    setWindow,
    close,
    onDisconnection,
    onConnection,
    increment,
    decrement,
    setChanelName,
    addClientToList,
    clearClients
} = channelSlice.actions;

export default channelSlice.reducer;
