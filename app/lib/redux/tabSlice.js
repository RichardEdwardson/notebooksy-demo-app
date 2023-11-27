import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: 0,
    disabled: [1], //[1]
}

const tabSlice = createSlice({
    name: "tabs",
    initialState,
    reducers: {
        gotoTab(state, action) {
            if (state.disabled.some(value => value == action.payload)) {
                state.disabled = state.disabled.filter(value => value !== action.payload)
            }        
            state.value = action.payload
        },
        setDisabledTabs(state, action) {
            state.disabled = action.payload
        },
        disableTab(state, action) {
            if (state.disabled.some(value => value == action.payload)) return
            state.disabled.push(action.payload)
        },
        enableTab(state, action) {
            state.disabled = state.disabled.filter(value => value !== action.payload)
        },
    }
})

export default tabSlice.reducer
export const { gotoTab, setDisabledTabs, disableTab, enableTab } = tabSlice.actions