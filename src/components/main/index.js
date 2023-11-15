import { useState, useEffect } from "react"
import LeftPanel from "./leftPanel"
import RightPanel from "./rightPanel"
import demoURL from './leftPanel/assets/demo.jpeg'
import { canvasToJPEG, loadImage, saveAsImage } from "../utilities/misc"


export default function Main() {
    const [imageFile, setImageFile] = useState({ file: null, url: demoURL })
    const [croppedNote, setCroppedNote] = useState(null)

    useEffect(() => {
        const handleDemo = async () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const demo = await loadImage(imageFile.url)
            const {naturalWidth: width, naturalHeight: height} = demo
            canvas.height = height
            canvas.width = width
            ctx.drawImage(demo, 0, 0)
            const demoFile = canvasToJPEG(canvas, 'demo')
            setImageFile({...imageFile, file: demoFile})
        }
        handleDemo()
    }, [])



    return (
        <>
            <div className="hidden lg:flex lg:w-full overflow-auto">
                <LeftPanel
                    inputImage={imageFile}
                    onGetNote={setCroppedNote}
                />
            </div>
            <div className="w-full lg:overflow-scroll h-full bg-slate-500">
                <RightPanel
                    onUpload={setImageFile}
                    note={croppedNote}
                />
            </div>
        </>
    )
}
