import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { Stage, Layer, Transformer, Image, Rect } from 'react-konva';
import { useConfirm } from './Confirmation';
import { Fab } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

const NoteImage = ({ shapeProps, isSelected, onSelect, onChange, onDelete, isDeleted }) => {
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
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            }
        </>
    )
}

const NotePad = forwardRef(({ addImage, toggleClear }, ref) => {
    const [notes, setNotes] = useState([]);
    const [deletedId, deleteShape] = useState(null);
    const [getConfirmation, Confirmation] = useConfirm()
    const [selectedId, selectShape] = useState(null);
    const pageRef = useRef(null)

    useEffect(() => {
        setNotes([])
    }, [toggleClear])

    useEffect(() => {
        if (addImage == null) return
        const note = {
            x: 10,
            y: 10,
            scaleX: .3,
            scaleY: .3,
            image: addImage,
            id: Date.now().toString(),
        }
        setNotes([...notes, note])
    }, [addImage])


    const checkDeselect = (e) => {
        if (typeof (e) == "boolean") {
            selectShape(null)
        } else {
            // if (e.target === e.target.getStage()) {
            //     selectShape(null)
            // }
            if (e.target === pageRef.current) {
                selectShape(null)
            }
        }

        // const clickedOnEmpty = e.target === e.target.getStage();
        // if (clickedOnEmpty) {
        //     selectShape(null);
        // }
    };

    const onDelete = async id => {
        const status = await getConfirmation('Delete this note?');
        if (status) deleteShape(id)
    }

    return (
        <>
            <Stage
                ref={ref}
                width={612}
                height={792}
                onMouseDown={e => {
                    checkDeselect(e)
                }}
                onTouchStart={checkDeselect}
            >
                <Layer>
                    <Rect
                        x={0}
                        y={0}
                        width={612}
                        height={792}
                        fill={"white"}
                        ref={pageRef}
                    />
                    {notes.map((note, i) => {
                        return (
                            <NoteImage
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
            <Confirmation />
        </>
    );
});

export default function WorkPlace({ receive }) {
    const [toggleClear, setToggleClear] = useState(true)
    const [getConfirmation, Confirmation] = useConfirm()
    const ref = useRef(null)
    //const [selectedId, selectShape] = useState(null);
    return (
        <div
            className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow"
        >
            <div
                className="px-4 py-1 sm:px-6"
            >
                <ButtonGroup
                    disableElevation
                    variant="contained"
                    aria-label="Disabled elevation buttons"
                >
                    <Button
                        onClick={() => {
                            if (ref != null) {
                                // try {
                                //     
                                // } catch (e) {
                                //     console.log(e)
                                // }
                                //selectShape(null)
                                ref.current.eventListeners.mousedown[0].handler(true)
                                setTimeout(() => {
                                    const stage = ref.current
                                    const name = Date.now().toString() + ".png"
                                    const link = document.createElement('a');
                                    link.download = name;
                                    link.href = stage.toDataURL({ pixelRatio: 3 })
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }, 100);
                                // const stage = ref.current
                                // const name = Date.now().toString() + ".png"
                                // const link = document.createElement('a');
                                // link.download = name;
                                // link.href = stage.toDataURL({ pixelRatio: 3 })
                                // document.body.appendChild(link);
                                // link.click();
                                // document.body.removeChild(link);
                            }
                        }}
                    >Save</Button>
                    <Button
                        onClick={async () => {
                            const status = await getConfirmation('Clear page?');
                            if (status) setToggleClear(!toggleClear)
                        }}
                    >Clear</Button>
                </ButtonGroup>
            </div>

            <Confirmation />
            <div class="px-4 py-5 sm:p-6">
                <NotePad
                    ref={ref}
                    addImage={receive}
                    toggleClear={toggleClear}
                />
            </div>
        </div>
    )
};