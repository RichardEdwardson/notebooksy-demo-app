import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    points: [],
    params: [],
    url: null,
}

const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {
        setPoints(state, action) {
            state.points = action.payload
        },
        movePoint(state, action) {
            const index = action.payload.index
            const newPoint = action.payload.coord
            state.points[index] = newPoint
        },
        setExtractedURL(state, action) {
            state.url = action.payload
        }
    }
})

export default dataSlice.reducer
export const {setPoints, movePoint, setExtractedURL } = dataSlice.actions