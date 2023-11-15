import { useRef, useState, useEffect, forwardRef } from 'react'
import { Stage, Layer, Image } from 'react-konva'
import { useSize, loadImage, sizeFitContain } from './misc'

export const ImageViewer = forwardRef(({ className, imageURL, children }, ref) => {
    const containerRef = useRef()
    const [size, observeFit] = useSize(sizeFitContain, { width: 0, height: 0, scaleX: 1, scaleY: 1 })
    const [image, setImage] = useState()

    useEffect(() => {
        const container = containerRef.current
        loadImage(imageURL)
            .then(img => {
                setImage(img)
                observeFit(img, container)
            })
    }, [imageURL])

    return (
        <div className={`flex h-full w-full ${className}`}
            ref={containerRef}
        >
            <Stage className='flex-none w-fit h-fit m-auto'
                ref={ref}
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
                    {children}
                </Layer>
            </Stage>
        </div>
    )

})
