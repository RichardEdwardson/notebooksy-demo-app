import { gotoTab } from "@/app/lib/redux/tabSlice"
import { useSizeContain, useSize } from "@/app/lib/sizeHooks"
import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { responsiveFontSizes } from "@mui/material"
import PolySelector from "./polySelector"
import ButtonContinue from "./button"
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { fetchImage, fetchPoints } from "@/app/lib/data"
import { readResponse } from "@/app/lib/utils"
import { setExtractedURL } from "@/app/lib/redux/dataSlice"
import { setIsLoading } from "@/app/lib/redux/imageInputSlice"

export default function FindBlackboard() {
    const imageData = useSelector(({ imageInput }) => imageInput.url)
    const pointsData = useSelector(({ data }) => data.points)
    const containerRef = useRef()
    const dispatch = useDispatch()
    const onFinish = () => {
        dispatch(gotoTab(1))
    }
    const isLoading = useSelector(({ imageInput }) => imageInput.isLoading)

    const handleClick = () => {
        dispatch(setIsLoading(true))
        fetchImage(imageData)
            .catch(console.log)
            .then(() => fetchPoints(pointsData))
            .catch(console.log)
            .then(res => readResponse(res))
            .catch(console.log)
            .then(dataURL => {
                dispatch(setExtractedURL(dataURL))
                dispatch(setIsLoading(false))
            })
    }

    return (
        <div className="flex flex-col w-full h-full relative" ref={containerRef}>
            <div className="flex-auto h-0 ">
                <PolySelector />
                {isLoading && (
                    <div className="absolute w-full">
                        <LinearProgress />
                    </div>
                )}
            </div>
            <div className="flex-none">
                <ButtonContinue onClick={handleClick}/>
            </div>
        </div>
    )
}
