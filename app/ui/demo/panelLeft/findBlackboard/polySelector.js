
import { useEffect, useRef } from "react";
import { Stage, Layer, Image, Circle, Line } from "react-konva";
import { useSizeContainPlus } from "@/app/lib/sizeHooks";
import { useDispatch, useSelector } from "react-redux"
import { dataURLtoBlob, dataURLtoFile, getInitialPoints, loadImage } from "@/app/lib/utils";
import { movePoint, setPoints } from "@/app/lib/redux/dataSlice";
import { setDataURL, setIsLoading } from "@/app/lib/redux/imageInputSlice";

export default function PolySelector() {
    const [size, observer, setNaturalSize] = useSizeContainPlus()
    const containerRef = useRef()
    const stageRef = useRef()
    const imageRef = useRef()
    const dispatch = useDispatch()
    const points = useSelector(({ data }) => data.points)
    const setCoordinates = coords => dispatch(setPoints(coords))
    const imageSource = useSelector(({ imageInput }) => imageInput.url)
    

    useEffect(() => {
        if (imageSource) {
            loadImage(imageSource)
                .then(img => {
                    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight })
                    imageRef.current.image(img)
                    setCoordinates(getInitialPoints(img, 0))
                })
        }
    }, [imageSource])

    useEffect(() => {
        const container = containerRef.current
        if (observer) {
            observer.observe(container)
        }
        return () => observer?.disconnect()
    }, [observer])

    const handleMove = (e, i) => {
        const x = e.target.x()
        const y = e.target.y()
        const r = 0
        const { naturalHeight: height, naturalWidth: width } = size
        if (x <= r) {
            e.target.x(r)
        }
        if (x >= width - r) {
            e.target.x(width - r)
        }
        if (y <= r) {
            e.target.y(r)
        }
        if (y >= height - r) {
            e.target.y(height - r)
        }
        dispatch(movePoint({ coord: { x: e.target.x(), y: e.target.y() }, index: i }))
    }

    return (
        <div className="flex h-full w-full bg-black"
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
                <Layer>
                    <Image ref={imageRef} />
                    <Line
                        points={[points.map(pt => ([pt.x, pt.y]))].flat(2)}
                        fill="white"
                        opacity={.4}
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
                                handleMove(e, i)
                            }}
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    )
}
