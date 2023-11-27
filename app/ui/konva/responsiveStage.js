import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from "react";
import { Stage } from "react-konva";

/**
 * Responsive Konva.Stage()
 * @param {} className - Extra className added to the container
 * @param {} fit - Fitting function
 */

export const ResponsiveStage = forwardRef(function ResponsiveStage({ fit, children }, ref) {
    const [size, containerRef] = useSizeResponsive(fit)
    const stageRef = useRef()

    useImperativeHandle(ref, () => ({
        container: containerRef.current,
        stage: stageRef.current,
        fitSize: size.setNaturalSize,
    }), [])

    return (
        <div className="flex h-full w-full"
            ref={containerRef}
        >
            <Stage
                className="flex-none h-fit w-fit m-auto"
                ref={stageRef}
                width={size.width}
                height={size.height}
                scaleX={size.scaleX}
                scaleY={size.scaleY}
            >
                {children}
            </Stage>
        </div>
    )
})

function useSizeResponsive(fn) {
    const containerRef = useRef()
    const [naturalSize, setNaturalSize] = useState()
    const [size, setSize] = useState({
        width: 0,
        height: 0,
        scaleX: 1,
        scaleY: 1,
        setNaturalSize,
    })

    useEffect(() => {
        let observer
        const container = containerRef.current
        if (naturalSize) {
            observer = new window.ResizeObserver(([{ contentRect }]) => {
                const calculatedSize = fn(naturalSize, contentRect)
                setSize({ ...size, ...calculatedSize })
            })
            observer.observe(container)
        }
        return () => observer?.disconnect()
    }, [naturalSize])

    return [size, containerRef]
}

export function objectContainFit(naturalSize, contentRect) {
    const { width: naturalWidth, height: naturalHeight } = naturalSize
    const { width: containerWidth, height: containerHeight } = contentRect

    const naturalAspectRatio = naturalWidth / naturalHeight
    const containerAspectRatio = containerWidth / containerHeight
    const fittedHeight = containerWidth / naturalAspectRatio
    const fittedWidth = containerHeight * naturalAspectRatio

    const size = {
        width: containerAspectRatio > naturalAspectRatio ? fittedWidth : containerWidth,
        height: containerAspectRatio > naturalAspectRatio ? containerHeight : fittedHeight,
    }
    size.scaleX = size.width / naturalWidth
    size.scaleY = size.height / naturalHeight

    return size
}