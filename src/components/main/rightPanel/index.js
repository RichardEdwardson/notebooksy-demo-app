import { useRef, useState, useEffect, createRef } from "react"
import { Notepad } from "./notepad"
import Dial from "./menu"
import { triggerImageUpload } from "../../utilities/misc"

export default function WorkPlace({ note, onUpload }) {
    const [clearTrigger, triggerClear] = useState(true)
    const [isDownloading, setIsDownloading] = useState(false)
    const containerRef = useRef()
    const notepadRef = useRef()
    const [notepadSize, setNotepadSize] = useState({
        width: 612,
        height: 792,
    })
    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            const size = entries[0].contentRect
            setNotepadSize({
                width: size.width - 20,
                height: (size.width - 20) * (792 / 612),
            })
        })
        if (containerRef) {
            observer.observe(containerRef.current.parentNode)
        }
        return () => observer.disconnect()
    }, [])


    const clearNotes = () => {
        notepadRef.current.clearPage()
    }

    const getNote = () => {
        triggerImageUpload(file => {
            onUpload({ file: file, url: URL.createObjectURL(file) })
        })
    }

    const saveNotes = () => {
        notepadRef.current.download()
    }




    return (
        <>
            <div
                ref={containerRef}
                className="overflow-scroll w-fit mx-auto py-2">
                <Notepad
                    ref={notepadRef}
                    input={note}
                    width={notepadSize.width}
                    height={notepadSize.height}
                    clearTrigger={clearTrigger}
                    isDownloaded={() => {
                        setIsDownloading(false)
                    }}
                    isDownloading={isDownloading}
                />
                <Dial
                    onTakeNote={getNote}
                    onSave={saveNotes}
                    onClear={clearNotes}
                />
            </div>

        </>
    )
}

