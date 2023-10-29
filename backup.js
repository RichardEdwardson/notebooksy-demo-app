import React, { useContext, useEffect } from 'react';
import { Stage, Layer, Rect, Transformer } from 'react-konva';

const Image = ({ shapeProps, isSelected, onSelect, onChange }) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();

    React.useEffect(() => {
        if (isSelected) {
            // we need to attach transformer manually
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <React.Fragment>
            <Rect
                onClick={onSelect}
                onTap={onSelect}
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
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
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
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(node.height() * scaleY),
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    );
};

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange }) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();

    React.useEffect(() => {
        if (isSelected) {
            // we need to attach transformer manually
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <React.Fragment>
            <Rect
                onClick={onSelect}
                onTap={onSelect}
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
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
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
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(node.height() * scaleY),
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    );
};

const initialRectangles = [
    {
        x: 120,
        y: 120,
        width: 100,
        height: 100,
        fill: 'red',
        id: 'rect1',
    },
    {
        x: 150,
        y: 150,
        width: 100,
        height: 100,
        fill: 'green',
        id: 'rect2',
    },
];

const NotePad = ({ addImage }) => {
    const [rectangles, setRectangles] = React.useState(initialRectangles);
    const [selectedId, selectShape] = React.useState(null);


    const checkDeselect = (e) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            selectShape(null);
        }
    };

    useEffect(() => {
        console.log(addImage)
    }, [addImage])

    return (
        <Stage
            width={612}
            height={792}
            onMouseDown={e => {
                checkDeselect(e)
                //console.log(extraction)
            }}
            onTouchStart={checkDeselect}
        >
            <Layer>
                {rectangles.map((rect, i) => {
                    return (
                        <Rectangle
                            key={i}
                            shapeProps={rect}
                            isSelected={rect.id === selectedId}
                            onSelect={() => {
                                selectShape(rect.id);
                            }}
                            onChange={(newAttrs) => {
                                const rects = rectangles.slice();
                                rects[i] = newAttrs;
                                setRectangles(rects);
                            }}
                        />
                    );
                })}
            </Layer>
        </Stage>
    );
};

export default function WorkPlace({ receive }) {
    return (
        <div style={{
            backgroundColor: "white",
            height: "100vh",
            marginTop: "10%",
        }}>
            <NotePad addImage={receive} />
        </div>
    )
};

//Newer
import { Image } from 'konva/lib/shapes/Image';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Transformer } from 'react-konva';

const initialRectangles = [
    {
        x: 120,
        y: 120,
        width: 100,
        height: 100,
        fill: 'red',
        id: 'rect1',
    },
    {
        x: 150,
        y: 150,
        width: 100,
        height: 100,
        fill: 'green',
        id: 'rect2',
    },
];

const NotePad = ({ addImage }) => {
    const [notes, setNotes] = useState([]);
    const [selectedId, selectShape] = useState(null);

    const addNote = (canvas) => {
        const note = {
            x: 100,
            y: 100,
            image: canvas,
        }
        setNotes([...notes, note])
    }


    const checkDeselect = (e) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            selectShape(null);
        }
    };

    useEffect(() => {
        console.log(addImage)
    }, [addImage])

    return (
        <Stage
            width={612}
            height={792}
            onMouseDown={e => {
                checkDeselect(e)
            }}
            onTouchStart={checkDeselect}
        >
            <Layer>
                {rectangles.map((rect, i) => {
                    return (
                        <Rectangle
                            key={i}
                            shapeProps={rect}
                            isSelected={rect.id === selectedId}
                            onSelect={() => {
                                selectShape(rect.id);
                            }}
                            onChange={(newAttrs) => {
                                const rects = rectangles.slice();
                                rects[i] = newAttrs;
                                setRectangles(rects);
                            }}
                        />
                    );
                })}
            </Layer>
        </Stage>
    );
};

export default function WorkPlace({ receive }) {
    return (
        <div style={{
            backgroundColor: "white",
            height: "100vh",
            marginTop: "10%",
        }}>
            <NotePad addImage={receive} />
        </div>
    )
};