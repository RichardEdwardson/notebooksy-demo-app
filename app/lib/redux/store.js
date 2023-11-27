import { configureStore } from '@reduxjs/toolkit'
import tabsReducers from "@/app/lib/redux/tabSlice"
import imageInputReducers from "@/app/lib/redux/imageInputSlice"
import dataReducers from "@/app/lib/redux/dataSlice"
import notepadReducers from "@/app/lib/redux/notepadSlice"

export default configureStore({
    reducer: {
        tabs: tabsReducers,
        imageInput: imageInputReducers,
        data: dataReducers,
        notepad: notepadReducers,
    },
    devTools: true,
})