import { Stage, Layer, Line, Circle, Rect } from 'react-konva'
import { useRef, useState, forwardRef, useImperativeHandle, useContext, useEffect } from 'react'
import { canvasDrawImage, canvasToJPEG, getPolyEditorSize } from '../../utilities/misc'

function useResize() {
    const [size, setSize] = useState()
    const observer = new ResizeObserver(([{ contentRect }]) => {
        setSize({
            width: contentRect.width,
            height: contentRect.height
        })
    })
    const observeResize = element => {
        observer.observe(element)
    }
    return [size, observeResize]
}

export default function BlackboardLocator({ className, data, inputImage }) {
    const [size2, observeResize2] = useResize()
    const canvasRef = useRef(null)
    const [size, setSize] = useState({ width: 10, height: 10 })
    const [points, setPoints] = useState([
        { x: 0, y: 0 },
        { x: 0, y: 100 },
        { x: 100, y: 100 },
        { x: 100, y: 0 },

    ])
    data.current.points = points

    useEffect(() => {
        const canvas = canvasRef.current;
        observeResize2(canvas)
        const { width: imageWidth, height: imageHeight } = canvas
        const { width: rectWidth, height: rectHeight } = canvas.getBoundingClientRect()
        setSize(getPolyEditorSize(imageWidth, imageHeight, rectWidth, rectHeight))

        const observer = new ResizeObserver(([{ contentRect: rect }]) => {
            const { width: rectWidth, height: rectHeight } = rect
            const { width: imageWidth, height: imageHeight } = canvas
            const polyEditorSize = getPolyEditorSize(imageWidth, imageHeight, rectWidth, rectHeight)
            setSize(polyEditorSize)
            const pts = points.slice()
            pts[1].y = polyEditorSize.height
            pts[2] = { x: polyEditorSize.width, y: polyEditorSize.height }
            pts[3].x = polyEditorSize.width
            setPoints(pts)
        })
        canvasDrawImage(canvas, inputImage.url, () => {
            if (inputImage.file == null) {
                data.current.demoImage = canvasToJPEG(canvas, 'demo')
            }
        })
        observer.observe(canvas)

        return () => {
            //observer.disconnect()
            console.log("cleaned")
        }
    }, [inputImage])

    useEffect(() => {
        if (size2) {
            console.log(size2)
        }    
    }, [size2])

    return (
        <div className={className + " relative"}>
            <canvas
                className='object-contain w-full h-full'
                ref={canvasRef}
            />
            <PolyEditor
                className={`absolute top-0 left-0`}
                points={points}
                onChange={setPoints}
                height={size.height}
                width={size.width}
            />
        </div>
    )
}


function PolyEditor({ points, onChange, height, width, className }) {
    const stageRef = useRef(null)

    return (
        <div className={className + " h-full w-full flex"}>
            <Stage
                ref={stageRef}
                className="w-fit h-fit flex-none m-auto "
                width={width}
                height={height}
            >
                <Layer>
                    <Rect
                        x={0}
                        y={0}
                        height={height}
                        width={width}
                        fill="blue"
                        opacity={.8}
                    />
                    {points.map((coords, i) => (
                        <Circle
                            key={i}
                            {...coords}
                            radius={10}
                            fill="red"
                            draggable
                            onDragMove={e => {
                                const pts = points.slice()
                                pts[i] = { x: e.target.x(), y: e.target.y() }
                                onChange(pts)
                            }}
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    )
}