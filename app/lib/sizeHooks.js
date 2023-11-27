import { useEffect, useReducer, useRef, useState } from "react"

export function useSize() {
    const [size, setSize] = useState()
    const observer = new ResizeObserver(([{ contentRect }]) => {
        setSize({
            width: contentRect.width,
            height: contentRect.height
        })
    })
    return [size, observer]
}

export function useSizeContain(size) {
    const [fittedSize, setFittedSize] = useState(size)
    const observer = new ResizeObserver(([{ contentRect }]) => {
        setFittedSize(sizeFitContain(size, contentRect))
    })
    return [fittedSize, observer]
}

export function useSizeContainPlus() {
    const [observer, setObserver] = useState()
    const [size, setSize] = useState({
        width: 0,
        height: 0,
        naturalWidth: 0,
        naturalHeight: 0,
        scaleX: 1,
        scaleY: 1,
        observer: null,
    })

    useEffect(() => {
        if (size.naturalHeight !== 0 && size.naturalWidth !== 0) {
            setObserver(new ResizeObserver(([{ contentRect }]) => {
                const naturalSize = { width: size.naturalWidth, height: size.naturalHeight }
                const calculatedSize = sizeFitContain(naturalSize, contentRect)
                setSize({ ...size, ...calculatedSize })
            }))
        }
    }, [size.naturalHeight, size.naturalWidth])

    const setNaturalSize = ({ width, height }) => {
        setSize({
            ...size,
            naturalWidth: width,
            naturalHeight: height,
        })
    }
    return [size, observer, setNaturalSize]
}

function sizeFitContain({ width: targetWidth, height: targetHeight }, { width: containerWidth, height: containerHeight }) {
    if (targetHeight == 0 || targetWidth == 0 || containerHeight == 0 || containerWidth == 0) {
        return {
            width: 100,
            height: 100,
            scaleX: 1,
            scaleY: 1,
        }
    }
    const targetAspectRatio = targetWidth / targetHeight
    const containerAspectRatio = containerWidth / containerHeight
    const size = { width: null, height: null, scaleX: null, scaleY: null }
    if (containerAspectRatio > targetAspectRatio) {
        size.height = containerHeight
        size.width = containerHeight * targetAspectRatio
    } else {
        size.width = containerWidth
        size.height = containerWidth / targetAspectRatio
    }
    size.scaleX = size.width / targetWidth
    size.scaleY = size.height / targetHeight
    return size
}

export function useSizeFit(fitFunction) {
    const [fittedElement, setFittedElement] = useState()
    const [size, setSize] = useState({
        width: 0,
        height: 0,
        scaleX: 1,
        scaleY: 1,
        fit: setFittedElement,
    })
    const containerRef = useRef()

    useEffect(() => {
        let observer
        const container = containerRef.current
        if (fittedElement) {
            observer = new window.ResizeObserver(([{ contentRect }]) => {
                const elementNaturalSize = { width: fittedElement.naturalWidth, height: fittedElement.naturalHeight }
                const calculatedSize = fitFunction(elementNaturalSize, contentRect)
                setSize({
                    ...size,
                    ...calculatedSize
                })
            })
            observer.observe(container)
        }
        return () => observer?.disconnect()
    }, [fittedElement])

    return [size, containerRef]
}


