
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Transformer, Image, Rect } from 'react-konva';
import { useConfirm } from "../../utilities/popups";
import { saveAsImage } from '../../utilities/misc';

const Note = ({ shapeProps, isSelected, onSelect, onChange, onDelete, isDeleted }) => {
    const shapeRef = useRef();
    const trRef = useRef();

    useEffect(() => {
        if (isSelected && !isDeleted) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    useEffect(() => {
        if (isDeleted) {
            shapeRef.current?.destroy()
            trRef.current?.destroy()
        }
    }, [isDeleted])

    return (
        <>
            <Image
                onDblClick={onDelete}
                onDblTap={onDelete}
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
            />
            {isSelected &&
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // if (newBox.width < 5 || newBox.height < 5) {
                        //     return oldBox;
                        // }
                        // return newBox;
                        return (newBox.width < 5 || newBox.height < 5) ? oldBox : newBox
                    }}
                />
            }
        </>
    )
}

export const Notepad = forwardRef(({ input, width, height, clearTrigger, isDownloading, isDownloaded }, ref) => {

    const [notes, setNotes] = useState([]);
    const [deletedId, deleteShape] = useState(null);
    const [getDeleteConfirmation, DeleteConfirmation] = useConfirm()
    const [selectedId, selectShape] = useState(null);
    const pageRef = useRef(null)
    const stageRef = useRef(null)

    useEffect(() => {
        setNotes([])
    }, [clearTrigger])

    useEffect(() => {
        if (isDownloading) {
            selectShape(null)
            download()
            isDownloaded()
        }
    }, [isDownloading])

    useEffect(() => {
        if (input == null) return
        const note = {
            x: 10,
            y: 10,
            scaleX: .3,
            scaleY: .3,
            image: input,
            id: Date.now().toString(),
        }
        setNotes([...notes, note])
    }, [input])

    const checkDeselect = (e) => {
        if (e.target === pageRef.current) {
            selectShape(null)
        }
    };

    const download = () => {
        const name = Date.now().toString()
        const pixelRatio = 3
        setTimeout(() => {
            saveAsImage(name, pixelRatio, stageRef.current)
        }, 100);
    }

    const onDelete = async id => {
        const status = await getDeleteConfirmation('Delete this note?');
        if (status) deleteShape(id)
    }
    useImperativeHandle(ref, () => ({
        download() {
            const name = Date.now().toString()
            const pixelRatio = 3
            selectShape(null)
            setTimeout(() => {
                saveAsImage(name, pixelRatio, stageRef.current)
            }, 100);
        },
        clearPage() {
            getDeleteConfirmation('Clear page?')
                .then(confirmed => {
                    if (confirmed) {
                        setNotes([])
                    }
                })
        },
    }), [])

    return (
        <>
            <Stage
                ref={stageRef}
                width={width}
                height={height}
                draggable
                onMouseDown={e => {
                    checkDeselect(e)
                }}
                onTouchStart={checkDeselect}
            >
                <Layer>
                    <Rect
                        x={0}
                        y={0}
                        width={width}
                        height={height}
                        fill={"white"}
                        ref={pageRef}
                    />
                    {notes.map((note, i) => {
                        return (
                            <Note
                                key={i}
                                onDelete={() => {
                                    onDelete(note.id);
                                }}
                                isDeleted={note.id === deletedId}
                                shapeProps={note}
                                isSelected={note.id === selectedId}
                                onSelect={() => {
                                    selectShape(note.id);
                                }}
                                onChange={(newAttrs) => {
                                    const nts = notes.slice();
                                    nts[i] = newAttrs;
                                    setNotes(nts);
                                }}
                            />
                        );
                    })}
                </Layer>
            </Stage>
            <DeleteConfirmation />
        </>
    );
})
