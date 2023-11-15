import { useRef, useState, useEffect } from 'react'
import { Stage, Layer, Line, Circle, Rect, Image } from 'react-konva'
import { useSize, sizeFitContain, loadImage, sizeFitWidth } from '../../utilities/misc'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { ImageViewer } from '../../utilities/responsiveKonva'
import controller from './assets/controller.jpg'

export default function GetNote({ receiveImage }) {
    return (
        <>
            <div className='flex-1 w-full h-full'>
                <ExtractionView
                    imageURL={receiveImage}
                />
            </div>
            <div className='flex-none w-full'>
                <XYController />
                <ToNotePad />
            </div>
        </>
    )
}
{/* <div className=''>
    <ToNotePad />

</div> */}

function ExtractionView({ imageURL }) {
    const containerRef = useRef()
    const [size, observeFit] = useSize(sizeFitContain, { width: 0, height: 0, scaleX: 1, scaleY: 1 })
    const [image, setImage] = useState()
    const [cropper, setCropper] = useState({ x: 0, y: 0, width: 0, height: 0 })

    useEffect(() => {
        const container = containerRef.current
        loadImage(imageURL)
            .then(img => {
                setImage(img)
                observeFit(img, container)
                setCropper({ x: 0, y: 0, width: img.width, height: img.height })
            })
    }, [imageURL])

    return (
        <div className={`flex h-full w-full`}
            ref={containerRef}
        >
            <Stage className='flex-none w-fit h-fit m-auto'
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
                    <Rect
                        {...cropper}
                        fill="blue"
                        opacity={.8}
                    />
                </Layer>
            </Stage>
        </div>
    )

}

function XYController() {
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

                </Layer>
            </Stage>
        </div>
    )
}

function ToNotePad() {
    return (
        <>
            <button
                type="button"
                className="flex w-full items-center gap-x-2 bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={null}
            >
                <CheckCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                Button text
            </button>
        </>
    )
}