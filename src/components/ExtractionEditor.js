import React, { useState, useRef, useEffect, forwardRef } from "react";
import controller from "../assets/controller.jpg";
import axios from "axios";
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress';
import { Button } from "@mui/material";

export default function ExtractionEditor({ send, receive, onNewPar }) {
    const [mouse, setMouse] = useState({ isClicked: false, position: { x: 0, y: 0 } });
    const [reload, toggleReload] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.src = receive
        image.onload = () => {
            const height = image.naturalHeight;
            const width = image.naturalWidth;
            canvas.height = height;
            canvas.width = width;
            ctx.drawImage(image, 0, 0);
        };
    }, [receive, reload]);

    const erase = e => {
        if (!mouse.isClicked) return
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const { width: imageWidth, offsetWidth: canvasWidth, height: imageHeight, offsetHeight: canvasHeight } = canvas;
        const scaleRatioX = imageWidth / canvasWidth;
        const scaleRatioY = imageHeight / canvasHeight;
        let { x, y } = mouse.position;
        x *= scaleRatioX;
        y *= scaleRatioY;
        const pointRadius = 20 * scaleRatioY;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.roundRect(x - pointRadius, y - pointRadius, 2 * pointRadius, 2 * pointRadius, pointRadius);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.restore();
    };

    return (
        <>
            <div
                className="overflow-hidden rounded-lg bg-white shadow"
            >
                <div
                    className="px-4 py-5 sm:p-6"
                >
                    <div
                        style={{
                            position: 'relative',
                            backgroundColor: 'blue',
                            borderRadius: '50%',
                            transform: `translate(${mouse.position.x}px, ${mouse.position.y + 10}px)`,
                            left: -5,
                            top: -5,
                            width: 10,
                            height: 10,
                            cursor: 'none'
                        }}
                        onPointerDown={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            setMouse({ ...mouse, isClicked: true })
                        }}
                        onPointerUp={e => { setMouse({ ...mouse, isClicked: false }) }}
                        onDoubleClick={e => {
                            toggleReload(!reload)
                        }}
                    ></div>
                    <canvas
                        className="object-cover w-full"
                        ref={canvasRef}
                        onPointerMove={e => {
                            const { pageX, pageY } = e.nativeEvent;
                            const { offsetLeft, offsetTop } = e.target;
                            const scrollTop = e.target.parentElement.parentElement.parentElement.parentElement.scrollTop
                            const canvasX = pageX - offsetLeft;
                            const canvasY = pageY - offsetTop + scrollTop;
                            setMouse({ ...mouse, position: { x: canvasX, y: canvasY } });
                            erase(e)
                        }}
                        style={{ cursor: 'none' }}
                    />
                    {isLoading &&
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    }
                    <Button
                        onClick={e => {
                            const imageObj = new Image()
                            imageObj.src = canvasRef.current.toDataURL("image/png")
                            imageObj.onload = () => {
                                send(imageObj)
                            }
                        }}
                    >To Notepad
                    </Button>
                </div>
            </div>
            <div
                className="overflow-hidden rounded-lg bg-white shadow"
            >
                <div
                    className="px-4 py-5 sm:p-6"
                >
                    <AdjustParameter
                        onNewPar={onNewPar}
                        onLoad={setIsLoading}
                    />
                </div>
            </div>

        </>
    );
};

function AdjustParameter({ onNewPar, onLoad }) {
    const position = useRef(null)
    const canvasRef = useRef(null)
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.src = controller
        image.onload = () => {
            const height = image.naturalHeight;
            const width = image.naturalWidth;
            canvas.height = height;
            canvas.width = width;
            ctx.drawImage(image, 0, 0);
        };
    }, []);
    return (
        <>
            <canvas
                ref={canvasRef}
                className="object-cover w-full"
                src={controller} alt="XYcontroller"
                onClick={e => {
                    onLoad(true)
                    const { pageX, pageY } = e.nativeEvent;
                    const { offsetLeft, offsetTop } = e.target;
                    const scrollTop = e.target.parentElement.parentElement.parentElement.parentElement.scrollTop
                    const x = pageX - offsetLeft;
                    const y = pageY - offsetTop + scrollTop;
                    position.current = { x: x, y: y }
                    const pars = {
                        blockSize: [x, e.target.offsetWidth],
                        offset: [y, e.target.offsetHeight],
                    }
                    console.log(pars)
                    // axios
                    //     .post("https://notebooksdemo-hvm11za5.b4a.run/upload/pars/", pars, { responseType: "blob" })
                    //     .then(res => {
                    //         const reader = new FileReader()
                    //         reader.readAsDataURL(res.data)
                    //         reader.onload = () => {
                    //             onNewPar(reader.result)
                    //             onLoad(false)
                    //         }
                    //     })
                    //     .catch(e => {
                    //         console.log(e)
                    //     })                
                }}
                style={{ cursor: 'crosshair' }}
            />
        </>
    );
};