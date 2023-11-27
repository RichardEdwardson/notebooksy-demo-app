import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Layer, Rect, Image, Transformer, Group } from "react-konva"
import { ResponsiveStage, objectContainFit } from "@/app/ui/konva/responsiveStage"
import { useSelector } from "react-redux"
import { URLtoImage, saveAsImage } from "@/app/lib/utils"
import { useConfirm } from "@/app/ui/demo/getConfirmation"

export default forwardRef(function Notepad(props, ref) {
    const letter = { width: 2550, height: 3300 }
    const containerRef = useRef()
    const newNote = useSelector(({ notepad }) => notepad.note)
    const [notes, setNotes] = useState([])
    const [selectedId, setSelectedId] = useState()
    const [getDeleteConfirmation, DeleteConfirmation] = useConfirm()

    useEffect(() => {
        const container = containerRef.current
        container.fitSize(letter)
    }, [])

    useEffect(() => {
        if (newNote == null) return
        URLtoImage(newNote)
            .catch(console.log)
            .then(img => {
                const aspectRatio = img.naturalHeight / img.naturalWidth
                const note = {
                    x: 10,
                    y: 10,
                    width: letter.width / 2,
                    height: letter.width * aspectRatio / 2,
                    image: img,
                    id: Date.now().toString()
                }
                setNotes([...notes, note])
            })
    }, [newNote])

    const handleChange = i => newAttrs => {
        const nts = notes.slice()
        nts[i] = newAttrs
        setNotes(nts)
    }

    const handleDelete = ({ target }) => {
        const group = target.getParent()
        getDeleteConfirmation('Delete this note?')
            .then(confirmed => {
                if (confirmed) group.destroy()
            })
    }

    useImperativeHandle(ref, () => ({
        download() {
            const name = Date.now().toString()
            const pixelRatio = 3
            setSelectedId(null)
            setTimeout(() => {
                saveAsImage(name, pixelRatio, containerRef.current.stage)
            }, 100);
        },
        clearPage() {
            getDeleteConfirmation('Clear page?')
                .then(confirmed => {
                    if (confirmed) setNotes([])
                })
        }
    }), [])

    return (
        <>
            <ResponsiveStage ref={containerRef} fit={objectContainFit}>
                <Layer>
                    <Rect
                        x={0}
                        y={0}
                        height={letter.height}
                        width={letter.width}
                        fill="white"
                        onMouseDown={() => setSelectedId(null)}
                        onTouchStart={() => setSelectedId(null)}
                    />
                    {notes.map((note, i) => (
                        <Note
                            key={i}
                            shapeProps={note}
                            onSelect={() => setSelectedId(note.id)}
                            isSelected={note.id === selectedId}
                            onChange={handleChange(i)}
                            onDelete={handleDelete}
                        />
                    ))}
                </Layer>
            </ResponsiveStage>
            <DeleteConfirmation />
        </>
    )
})

function Note({ shapeProps, isSelected, onSelect, onChange, onDelete }) {
    const shapeRef = useRef();
    const trRef = useRef();
    const groupRef = useRef()

    const boundedBy = node => (oldBox, newBox) => {
        const inBound = newBox.x >= 0 &&
            newBox.y >= 0 &&
            Math.round(newBox.x + newBox.width) <= node.width() &&
            Math.round(newBox.y + newBox.height) <= node.height()
        return inBound ? newBox : oldBox
    }

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

    useEffect(() => {
        if (isSelected) {
            const stage = shapeRef.current.getStage()
            const transformer = trRef.current
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
            transformer.boundBoxFunc(boundedBy(stage))
        }
    }, [isSelected]);

    return (
        <>
            <Group ref={groupRef}>
                <Image
                    onDblClick={onDelete}
                    onDblTap={onDelete}
                    onClick={onSelect}
                    onTap={onSelect}
                    ref={shapeRef}
                    {...shapeProps}
                    draggable
                    onDragMove={handleMove}
                    onTransformEnd={handleTransformEnd}
                />
                {isSelected &&
                    <Transformer
                        flipEnabled={false}
                        ref={trRef}
                        rotateEnabled={false}
                    />
                }
            </Group>
        </>
    )
}