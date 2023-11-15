import { useRef, forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { Stage, Layer, Line, Circle, Rect, Image } from 'react-konva'

export default function PolySelector({ imageURL, onPointsMove: setPoints, points }) {
    const stageRef = useRef()
    const containerRef = useRef()
    const [size, observeFit] = useSize(sizeFitContain, { width: 0, height: 0, scaleX: 1, scaleY: 1 })
    const [image, setImage] = useState()

    useEffect(() => {
        const stage = stageRef.current
        const container = containerRef.current

        loadImage(imageURL)
            .then(img => {
                setImage(img)
                observeFit(img, container)
                setPoints([
                    { x: 0, y: 0 },
                    { x: img.width, y: 0 },
                    { x: img.width, y: img.height },
                    { x: 0, y: img.height }
                ])
            })
    }, [imageURL])

    const handleDragging = (e, i) => {
        const pts = points.slice()
        pts[i] = { x: e.target.x(), y: e.target.y() }
        setPoints(pts)
    }

    return (
        <div className='flex h-full w-full bg-black'
            ref={containerRef}
        >
            <Stage className='flex-none w-fit h-fit m-auto'
                ref={stageRef}
                width={size.width}
                height={size.height}
                scaleX={size.scaleX}
                scaleY={size.scaleY}
            >
                <Layer>
                    <Image
                        x={0}
                        y={0}
                        image={image}
                    />
                    <Line
                        points={[points.map(pt => ([pt.x, pt.y]))].flat(2)}
                        stroke="black"
                        strokeWidth={4 / size.scaleX}
                        closed
                    />
                    <Line
                        points={[points.map(pt => ([pt.x, pt.y]))].flat(2)}
                        fill="blue"
                        opacity={.5}
                        closed
                    />
                    {points.map((coord, i) => (
                        <Circle
                            key={i}
                            {...coord}
                            radius={50 / size.scaleX}
                            stroke="red"
                            strokeWidth={4 / size.scaleX}
                            draggable
                            onDragMove={e => {
                                handleDragging(e, i)
                            }}
                        />
                    ))}                    
                </Layer>
            </Stage>
        </div>
    )
}

function useSize(fit, init) {
    const [size, setSize] = useState(init)
    const observeFit = (target, container) => {
        const observer = new ResizeObserver(([{ contentRect }]) => {
            setSize(fit(target, contentRect))
        })
        observer.observe(container)
    }
    return [size, observeFit]
}

function sizeFitContain({ width: targetWidth, height: targetHeight }, { width: containerWidth, height: containerHeight }) {
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

const loadImage = src => new Promise(resolve => {
    const image = new window.Image()
    image.onload = () => resolve(image)
    image.src = src
})



// function useSize(initSize) {
//     const [size, setSize] = useState(initSize)
//     const observer = new ResizeObserver(([{ contentRect }]) => {
//         setSize({
//             width: contentRect.width,
//             height: contentRect.height
//         })
//     })
//     const getSize = element => {
//         observer.observe(element)
//     }
//     return [size, getSize]
// }



