import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    note: null,
}

const notepadSlice = createSlice({
    name: "notepad",
    initialState,
    reducers: {
        addNote(state, action) {
            state.note = action.payload
        }
    }
})

export default notepadSlice.reducer
export const { addNote } = notepadSlice.actions