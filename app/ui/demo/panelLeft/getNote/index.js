import { useEffect, useRef, useState } from "react"
import ButtonContinue from "@/app/ui/demo/panelLeft/getNote/button"
import NoteSelector from "./noteSelector"
import ParamSelector from "./paramSelector"
import { LinearProgress } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { addNote } from "@/app/lib/redux/notepadSlice"
import { setShowPanel } from "@/app/lib/redux/imageInputSlice"

export default function GetNote() {
    const isLoading = useSelector(({ imageInput }) => imageInput.isLoading)
    const [cropToggle, toggleCrop] = useState()
    const noteSelectorRef = useRef()
    const dispatch = useDispatch()

    useEffect(() => {
        const noteSelector = noteSelectorRef.current
        if (cropToggle != undefined) {
            noteSelector.crop()
        }
    }, [cropToggle])

    const cropNote = () => {
        toggleCrop(cropToggle != undefined ? !cropToggle : true)
        dispatch(setShowPanel(false))
    }

    const handleCrop = dataURL => {
        dispatch(addNote(dataURL))
    }

    return (
        <div className="flex flex-col w-full h-full relative">
            <div className="flex-auto h-0 bg-white">
                <NoteSelector 
                    ref={noteSelectorRef}
                    onCrop={handleCrop}
                    />
            </div>
            <div className="flex-none flex flex-col">
                <div className="flex-none">
                    <ParamSelector />
                </div>
                {isLoading && (
                    <div className="absolute w-full">
                        <LinearProgress />
                    </div>
                )}
                <div className="flex-none">
                    <ButtonContinue onClick={cropNote} />
                </div>
            </div>
            
        </div>
    )
}