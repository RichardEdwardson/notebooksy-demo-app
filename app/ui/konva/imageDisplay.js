import { forwardRef, use, useEffect, useImperativeHandle, useRef } from "react";
import { Stage, Layer, Image } from "react-konva";
import { useSizeContainPlus, useSizeFit } from "@/app/lib/sizeHooks";
import { URLtoImage, fitToWidth, sizeFitWidth } from "@/app/lib/utils";

/**
 * Generates fitted image display using Konva.Image()
 * @param {} className - Extra className added to the container
 * @param {} src - The image src
 * @param {} fit - Fitting function
 */

const KonvaImageDisplay = forwardRef(({ src, fit, className, children }, ref) => {
    const [size, containerRef] = useSizeFit(fit)
    const stageRef = useRef()
    const layerRef = useRef()
    const imageRef = useRef()

    const handleImage = img => {
        imageRef.current.image(img)
        size.fit(img)
    }

    const handleError = () => {
        console.log("image failed to load")
    }

    useEffect(() => {
        if (src) {
            URLtoImage(src)
                .catch(handleError)
                .then(handleImage)
        }
    }, [src])

    useImperativeHandle(ref, () => ({
        container: containerRef.current,
        stage: stageRef.current,
        layer: layerRef.current,
        image: imageRef.current,
    }), [])

    return (
        <div className={`flex h-full w-full ${className}`}
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
                <Layer ref={layerRef}>
                    <Image ref={imageRef} />
                    {children}
                </Layer>
            </Stage>
        </div>
    )

})
KonvaImageDisplay.displayName = "KonvaImageDisplay"
export default KonvaImageDisplay