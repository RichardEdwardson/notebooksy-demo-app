import ImageDisplay from "@/app/ui/konva/imageDisplay"
import controller from "./controller.jpg"
import { useEffect, useRef, useState } from "react"
import { readResponse, sizeFitWidth } from "@/app/lib/utils"
import { Circle } from "react-konva"
import { fetchParameters } from "@/app/lib/data"
import { useDispatch } from "react-redux"
import { setIsLoading } from "@/app/lib/redux/imageInputSlice"
import { setExtractedURL } from "@/app/lib/redux/dataSlice"

const initCircle = {
    x: 1890 / 2,
    y: 584 / 2,
    radius: 50,
    fill: "red",
}

export default function ParamSelector() {
    const displayRef = useRef()
    const circleRef = useRef()
    const dispatch = useDispatch()
    const [circleProps, setCircleProps] = useState(initCircle)

    const handleDragEnd = e => {
        setCircleProps({
            ...circleProps,
            x: e.target.x(),
            y: e.target.y(),
        })
    }

    const handleMove = ({ target }) => {
        const bound = target.getStage()
        const r = target.radius()
        const x = target.x()
        const y = target.y()
        const width = bound.width() / bound.scaleX()
        const height = bound.height() / bound.scaleY()
        if (x <= r) {
            target.x(r)
        }
        if (x >= width - r) {
            target.x(width - r)
        }
        if (y <= r) {
            target.y(r)
        }
        if (y >= height - r) {
            target.y(height - r)
        }
    }

    useEffect(() => {     
        const controllerImage = displayRef.current.image
        const controllerSize = {
            width: controllerImage.width(),
            height: controllerImage.height()
        }
        if (circleProps != initCircle) {
            dispatch(setIsLoading(true))
            fetchParameters(circleProps, controllerSize)
                .catch(console.log)
                .then(readResponse)
                .then(dataURL => {
                    dispatch(setExtractedURL(dataURL))
                    dispatch(setIsLoading(false))
                })
        }

    }, [circleProps])

    return (
        <ImageDisplay
            src={controller.src}
            ref={displayRef}
            fit={sizeFitWidth}
        >
            <Circle
                ref={circleRef}
                {...circleProps}
                draggable
                onDragEnd={handleDragEnd}
                onDragMove={handleMove}
            />

        </ImageDisplay>
    )
}
