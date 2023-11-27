
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Layer, Image, Rect, Transformer } from "react-konva";
import { useSelector } from "react-redux"
import { URLtoImage } from "@/app/lib/utils";
import { ResponsiveStage, objectContainFit } from "@/app/ui/konva/responsiveStage";

export default forwardRef(function NoteSelector({onCrop}, ref) {
    const [cropper, setCropper] = useState({ x: 0, y: 0, width: 0, height: 0 })
    const containerRef = useRef()
    const imageRef = useRef()
    const imageSource = useSelector(({ data }) => data.url)

    useEffect(() => {
        const container = containerRef.current
        if (imageSource) {
            URLtoImage(imageSource)
                .then(img => {
                    container.fitSize({ width: img.naturalWidth, height: img.naturalHeight })
                    imageRef.current.image(img)
                    setCropper({
                        x: 0,
                        y: 0,
                        width: img.width,
                        height: img.height,
                        fill: "blue",
                        opacity: .2,
                    })
                })
        }
    }, [imageSource])

    useImperativeHandle(ref, () => ({
        crop() {
            const note = imageRef.current.clone()
            note.crop(cropper)
            note.size(cropper)
            onCrop(note.toDataURL())
        }
    }), [cropper])

    return (
        <ResponsiveStage ref={containerRef} fit={objectContainFit}>
            <Layer>
                <Image ref={imageRef} />
                <Cropper
                    shapeProps={cropper}
                    onChange={setCropper}
                />
            </Layer>
        </ResponsiveStage>
    )
})

function Cropper({ shapeProps, onChange }) {
    const shapeRef = useRef();
    const trRef = useRef();

    useEffect(() => {
        const stage = shapeRef.current.getStage()
        const transformer = trRef.current
        trRef.current.nodes([shapeRef.current]);
        trRef.current.getLayer().batchDraw();
        transformer.boundBoxFunc(boundedBy(stage))
    }, []);

    const handleMove = ({ target }) => {
        const stage = target.getStage()
        const height = stage.height() / stage.scaleY()
        const width = stage.width() / stage.scaleX()
        const x = target.x()
        const y = target.y()
        const rectWidth = target.width()
        const rectHeight = target.height()

        if (x <= 0) {
            target.x(0)
        }
        if (x >= width - rectWidth) {
            target.x(width - rectWidth)
        }
        if (y <= 0) {
            target.y(0)
        }
        if (y >= height - rectHeight) {
            target.y(height - rectHeight)
        }
        onChange({
            ...shapeProps,
            x: target.x(),
            y: target.y(),
        })
    }

    const handleTransformEnd = ({ target }) => {
        const stage = target.getStage()
        const scaleX = target.scaleX();
        const scaleY = target.scaleY();
        target.scaleX(1);
        target.scaleY(1);
        const width = Math.max(10 / stage.scaleX(), target.width() * scaleX)
        const height = Math.max(10 / stage.scaleY(), target.height() * scaleY)
        onChange({ ...shapeProps, width, height, y: target.y(), x: target.x() });
    }

    const boundedBy = node => (oldBox, newBox) => {
        const inBound = newBox.x >= 0 &&
            newBox.y >= 0 &&
            Math.round(newBox.x + newBox.width) <= node.width() &&
            Math.round(newBox.y + newBox.height) <= node.height()
        return inBound ? newBox : oldBox
    }

    return (
        <>
            <Rect
                ref={shapeRef}
                {...shapeProps}
                draggable
                onDragMove={handleMove}
                onTransformEnd={handleTransformEnd}
            />
            <Transformer
                ref={trRef}
                flipEnabled={false}
                borderEnabled={true}
                rotateEnabled={false}
                ignoreStroke
                borderStrokeWidth={1}
            />
        </>
    );
};