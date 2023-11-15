import { useRef, useState, useEffect } from 'react'
import { Stage, Layer, Line, Rect, Image, Transformer } from 'react-konva'
import { useSize, sizeFitContain, loadImage, sizeFitWidth } from '../../../utilities/misc'

const Cropper = ({ shapeProps, onChange }) => {
    const shapeRef = useRef();
    const trRef = useRef();

    useEffect(() => {
        trRef.current.nodes([shapeRef.current]);
        trRef.current.getLayer().batchDraw();
    }, []);

    return (
        <>
            <Rect
                ref={shapeRef}
                {...shapeProps}
                draggable
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }}
                onTransformEnd={(e) => {
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        // set minimal value
                        width: Math.max(10, node.width() * scaleX),
                        height: Math.max(10, node.height() * scaleY),
                    });
                }}
            />
            <Transformer
                ref={trRef}
                flipEnabled={false}
                borderEnabled={true}
                rotateEnabled={false}
                boundBoxFunc={(oldBox, newBox) => {
                    // limit resize
                    if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                        return oldBox;
                    }
                    return newBox;
                }}
            />
        </>
    );
};

export default function ExtractionView({ imageURL, cropToggle, onCrop }) {
    const containerRef = useRef()
    const imageRef = useRef()
    const [size, observeFit] = useSize(sizeFitContain, { width: 0, height: 0, scaleX: 1, scaleY: 1 })
    const [image, setImage] = useState()
    const [cropper, setCropper] = useState({ x: 0, y: 0, width: 0, height: 0 })

    useEffect(() => {
        const container = containerRef.current
        loadImage(imageURL)
            .then(img => {
                setImage(img)
                observeFit(img, container)
                setCropper({
                    x: img.width / 4,
                    y: img.height / 4,
                    width: img.width / 2,
                    height: img.height / 2,
                    fill: "blue",
                    opacity: .2
                })
            })
        //imageRef.current.toImage().then(console.log)
    }, [imageURL])

    useEffect(() => {
        console.log(cropper)
    }, [cropper])

    useEffect(() => {
        const croppedNote = imageRef.current.clone({ height: cropper.height, width: cropper.width})
        croppedNote.crop({
            x: cropper.x,
            y: cropper.y,
            height: cropper.height,
            width: cropper.width
        })
        croppedNote.toImage().then(onCrop)
    }, [cropToggle])

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
                        ref={imageRef}
                        x={0}
                        y={0}
                        image={image}
                    />
                    <Cropper
                        shapeProps={cropper}
                        onChange={setCropper}
                    />
                </Layer>
            </Stage>
        </div>
    )

}