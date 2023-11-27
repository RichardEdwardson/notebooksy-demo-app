"use client"
import Notepad from "@/app/ui/demo/panelRight/notepad"
import NotepadSpeedDial from "@/app/ui/demo/panelRight/dial"
import { useDispatch, useSelector } from "react-redux"
import { fileToDataURLPromise, triggerImageUploadPromise } from "@/app/lib/utils"
import { setDataURL, setIsLoading, setShowPanel } from "@/app/lib/redux/imageInputSlice"
import PanelLeftMobile from "@/app/ui/demo/panelLeftMobile"
import { useEffect, useRef, useState } from "react"
import { gotoTab } from "@/app/lib/redux/tabSlice"

export default function Workspace() {
    const showMobilePanel = useSelector(({ imageInput }) => imageInput.showPanel)
    const notepadRef = useRef()
    const dispatch = useDispatch()
    const [saveToggle, toggleSave] = useState()
    const [clearToggle, toggleClear] = useState()
    const mq = window.matchMedia("(min-width: 1024px)")
    mq.onchange = () => {
        if (mq.matches && showMobilePanel) {
            dispatch(setShowPanel(false))
        } else {
            dispatch(setShowPanel(true))
        }
    }

    const getNote = () => {
        triggerImageUploadPromise()
            .then(file => {
                dispatch(setIsLoading(true))
                return fileToDataURLPromise(file)
            })
            .then(dataURL => {
                dispatch(setDataURL(dataURL))
                dispatch(setIsLoading(false))
                dispatch(gotoTab(0))
                if (!mq.matches) dispatch(setShowPanel(true))
            })
    }

    const handleSave = () => {
        toggleSave(saveToggle == undefined ? true : !saveToggle)
    }

    const handleClear = () => {
        toggleClear(clearToggle == undefined ? true : !clearToggle)
    }

    useEffect(() => {
        if (saveToggle == undefined) return
        notepadRef.current.download()
    }, [saveToggle])

    useEffect(() => {
        if (clearToggle == undefined) return
        notepadRef.current.clearPage()
    }, [clearToggle])

    return (
        <div className="flex flex-col h-full w-full pb-24 md:pb-0 relative">
            <PanelLeftMobile show={showMobilePanel}/>

            <div className="flex-auto h-0 py-4">
                <Notepad ref={notepadRef}/>
            </div>
            <NotepadSpeedDial
                onTakeNote={getNote}
                onSave={handleSave}
                onClear={handleClear}
                hide={showMobilePanel}
            />
        </div>
    )
}