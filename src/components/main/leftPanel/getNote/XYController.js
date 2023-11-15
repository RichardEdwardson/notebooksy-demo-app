import { useRef, useState, useEffect } from 'react'
import { Stage, Layer, Line, Circle, Rect, Image } from 'react-konva'
import { useSize, sizeFitContain, loadImage, sizeFitWidth, readResponse } from '../../../utilities/misc'

import controller from '../assets/controller.jpg'
import { sendParameters } from '../../../utilities/fetch'

export default function XYController({ onChange, position }) {
    const stageRef = useRef()
    const containerRef = useRef()
    const [size, observeFit] = useSize(sizeFitWidth, { width: 0, height: 0, scaleX: 1, scaleY: 1 })
    const [image, setImage] = useState()

    useEffect(() => {
        const container = containerRef.current
        loadImage(controller)
            .then(img => {
                setImage(img)
                observeFit(img, container)
            })
    }, [])

    

    return (
        <div className={`flex h-full w-full`}
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
                    <Circle
                        {...position}
                        radius={50}
                        fill="blue"
                        draggable
                        onDragEnd={e => {
                            onChange({ x: e.target.x(), y: e.target.y() })
                        }}
                    />

                </Layer>
            </Stage>
        </div>
    )
}