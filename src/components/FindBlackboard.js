import React, { useState, useRef, useEffect } from "react";
import demoBlackboard from "../assets/demo_blackboard.jpeg"
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import axios from 'axios';

// function testFileIntegrity(file) {
//     let testURL
//     const reader = new FileReader();
//     reader.onload = e => {
//         testURL = e.target.result;
//         const link = document.createElement('a');
//         link.download = "file.jpeg";
//         link.href = testURL
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };
//     reader.readAsDataURL(file);    
// }

function dataURLtoBlob(dataURL) {
    const parts = dataURL.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];
    const b64Data = atob(parts[1]);
    const array = new Uint8Array(b64Data.length);

    for (let i = 0; i < b64Data.length; i++) {
        array[i] = b64Data.charCodeAt(i);
    }

    return new Blob([array], { type: mime });
}

export default function FindBlackboard({ onFinish, onNewImage }) {
    const [imageFile, setImageFile] = useState({ file: null, url: demoBlackboard });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [reload, toggleReload] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const canvasRef = useRef(null);
    const points = useRef([]);
    const demoFile = useRef(null);

    const handleFile = (event) => {
        onNewImage()
        const file = event.target.files[0];
        setImageFile({
            file: file,
            url: URL.createObjectURL(file),
        });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.src = imageFile.url;
        image.onload = () => {
            const height = image.naturalHeight;
            const width = image.naturalWidth;
            canvas.height = height;
            canvas.width = width;
            ctx.drawImage(image, 0, 0);
            if (imageFile.file == null) {
                const dataURL = canvasRef.current.toDataURL("image/jpeg")
                const demoBlob = dataURLtoBlob(dataURL)
                const file = new File([demoBlob], 'demo.jpg', { type: 'image/jpeg' });
                demoFile.current = file
            }
        };
        
    }, [imageFile, reload]);

    const drawPoint = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { width: imageWidth, offsetWidth: canvasWidth, height: imageHeight, offsetHeight: canvasHeight } = canvas;
        const scaleRatioX = imageWidth / canvasWidth;
        const scaleRatioY = imageHeight / canvasHeight;

        let { x, y } = position;
        x *= scaleRatioX;
        y *= scaleRatioY;
        points.current.push({ left: x, top: y });
        if (points.current.length === 4) {
            setShowDialog(true);
        };
        const pointRadius = 5 * scaleRatioY;
        ctx.beginPath();
        ctx.roundRect(x - pointRadius, y - pointRadius, 2 * pointRadius, 2 * pointRadius, pointRadius);
        ctx.fillStyle = "red";
        ctx.fill();
    };

    return (
        <>           
            <ImageUpload onChange={handleFile} />
            <ConfirmAction
                open={showDialog}
                onConfirm={e => {
                    toggleReload(!reload);
                    submitForm(imageFile.file == null ? demoFile.current : imageFile.file, points.current, setIsLoading, onFinish);
                    setShowDialog(false);
                    points.current = [];
                    
                }}
                onCancel={e => {
                    toggleReload(!reload);
                    setShowDialog(false);
                    points.current = [];
                }}
            />
            <div
                style={{
                    position: 'relative',
                    backgroundColor: 'red',
                    borderRadius: '50%',
                    transform: `translate(${position.x}px, ${position.y + 10}px)`,
                    left: -5,
                    top: -5,
                    width: 10,
                    height: 10,
                    cursor: 'none'
                }}
                onPointerDown={drawPoint}
            >
            </div>
            <canvas
                className="object-cover w-full"
                ref={canvasRef}
                onPointerMove={e => {
                    const { pageX, pageY } = e.nativeEvent;
                    const { offsetLeft, offsetTop } = e.target;
                    const scrollTop = e.target.parentElement.parentElement.parentElement.parentElement.scrollTop
                    const canvasX = pageX - offsetLeft;
                    const canvasY = pageY - offsetTop + scrollTop;
                    setPosition({ ...position, x: canvasX, y: canvasY });
                }}
                style={{ cursor: 'none' }}
            />
            {isLoading &&
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            }

        </>
    );
};

async function submitForm(file, points, onLoad, callback) {
    onLoad(true)
    const formData = new FormData();
    formData.append("file", file)
    try {
        const res = await axios.post("https://notebooksdemo-hvm11za5.b4a.run/upload/image/", formData)
    } catch (e) {
        console.log(e)
    }
    axios
        .post("https://notebooksdemo-hvm11za5.b4a.run/upload/points/", points, { responseType: "blob" })
        .then(res => {
            const reader = new FileReader()
            reader.readAsDataURL(res.data)
            reader.onload = () => {
                callback(reader.result)
                onLoad(false)
            }
        })
        .catch(e => {
            console.log(e)
        })
}

function ConfirmAction({ open, onCancel, onConfirm }) {
    return (
        <div>
            <Dialog
                open={open}
                onClose={onCancel}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm selection?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button onClick={onConfirm}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

function ImageUpload(props) {
    return (
        <div>
            <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                multiple={false}
                onChange={props.onChange}
            />
        </div>
    );
};



