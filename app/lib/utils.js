import { useRef, forwardRef, useImperativeHandle, useState, useEffect } from 'react'

export function saveAsImage(name, pixelRatio, ref) {
    const link = document.createElement('a');
    link.download = name + ".png";
    link.href = ref.toDataURL({ pixelRatio: pixelRatio });
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function dataURLtoBlob(dataURL) {
    const parts = dataURL.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];
    const b64Data = atob(parts[1]);
    const array = new Uint8Array(b64Data.length);

    for (let i = 0; i < b64Data.length; i++) {
        array[i] = b64Data.charCodeAt(i);
    }
    return new Blob([array], { type: mime });
}

export function dataURLtoFile(dataURL, name) {
    const parts = dataURL.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];
    const filename = [name, mime.split("/")[1]].join(".")
    const b64Data = atob(parts[1]);
    const array = new Uint8Array(b64Data.length);
    let i = b64Data.length
    while (i--) {
        array[i] = b64Data.charCodeAt(i);
    }
    return new File([array], filename, { type: mime });
}

export function triggerImageUpload(callback) {
    const input = document.createElement('input')
    document.body.appendChild(input);
    input.type = "file"
    input.accept = "image/png, image/jpeg, image/jpg"
    input.multiple = false
    input.onchange = e => {
        const file = e.target.files[0]
        callback(file)
    }
    input.click()
    document.body.removeChild(input);
}

export function canvasToJPEG(canvas, name) {
    const dataURL = canvas.toDataURL("image/jpeg")
    const demoBlob = dataURLtoBlob(dataURL)
    return new File([demoBlob], `${name}.jpg`, { type: 'image/jpeg' });
}

export function canvasDrawImage(canvas, src, callback) {
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = src;
    image.onload = () => {
        const height = image.naturalHeight;
        const width = image.naturalWidth;
        canvas.height = height;
        canvas.width = width;
        ctx.drawImage(image, 0, 0);
        callback()
    };
}

export function sortPoints(pts) {
    const sortedY = pts.sort((a, b) => (a.y - b.y))
    const sortedTop = sortedY
        .slice(0, 2)
        .sort((a, b) => (a.x - b.x))
        .map(pt => Object.values(pt))
        .flat(1)
    const sortedBottom = sortedY
        .slice(2, 4)
        .sort((a, b) => (b.x - a.x))
        .map(pt => Object.values(pt))
        .flat(1)
    return [...sortedTop, ...sortedBottom]
}

export function getPolyEditorSize(imageWidth, imageHeight, rectWidth, rectHeight) {
    const imageRatio = imageWidth / imageHeight
    const rectRatio = rectWidth / rectHeight
    const size = { width: null, height: null }

    if (rectRatio > imageRatio) {
        size.height = rectHeight
        size.width = rectHeight * imageRatio
    } else {
        size.width = rectWidth
        size.height = rectWidth / imageRatio
    }

    return size
}

export function useSize(fit, init) {
    const [size, setSize] = useState(init)
    const observeFit = (target, container) => {
        const observer = new ResizeObserver(([{ contentRect }]) => {
            setSize(fit(target, contentRect))
        })
        observer.observe(container)
    }
    return [size, observeFit]
}

export function sizeFitContain({ width: targetWidth, height: targetHeight }, { width: containerWidth, height: containerHeight }) {
    const targetAspectRatio = targetWidth / targetHeight
    const containerAspectRatio = containerWidth / containerHeight
    const size = { width: null, height: null, scaleX: null, scaleY: null }
    if (containerAspectRatio > targetAspectRatio) {
        size.height = containerHeight
        size.width = containerHeight * targetAspectRatio
    } else {
        size.width = containerWidth
        size.height = containerWidth / targetAspectRatio
    }
    size.scaleX = size.width / targetWidth
    size.scaleY = size.height / targetHeight
    return size
}

export function sizeFitWidth({ width: targetWidth, height: targetHeight }, { width: containerWidth, height: containerHeight }) {
    const targetAspectRatio = targetWidth / targetHeight
    const containerAspectRatio = containerWidth / containerHeight
    const size = { width: null, height: null, scaleX: null, scaleY: null }

    size.width = containerWidth
    size.height = containerWidth / targetAspectRatio

    size.scaleX = size.width / targetWidth
    size.scaleY = size.height / targetHeight
    return size
}

export const loadImage = src => new Promise(resolve => {
    const image = new window.Image()
    image.onload = () => resolve(image)
    image.src = src
})

export async function handleDemo(demoURL) {
    const demo = document.createElement('canvas')
    const ctx = demo.getContext('2d')
    ctx.drawImage(await loadImage(demoURL), 0, 0)
}

export const readResponse = res => {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result)
        reader.onerror = e => reject(e)
        reader.readAsDataURL(res.data)
    })
}

export const getInitialPoints = ({ naturalWidth: width, naturalHeight: height }, pad) => ([
    { x: pad, y: pad },
    { x: width - pad, y: pad },
    { x: width - pad, y: height - pad },
    { x: pad, y: height - pad }
])

export const imgToJPEG = (img, name) => {
    return (null)
}

export const fileToDataURLPromise = file => new Promise((resolve, reject) => {
    const reader = new window.FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = e => reject(e)
    reader.readAsDataURL(file)
})

export const triggerImageUploadPromise = () => new Promise(resolve => {
    const input = document.createElement('input')
    input.style = {display: "none"}
    document.body.appendChild(input);
    input.type = "file"
    input.accept = "image/png, image/jpeg, image/jpg"
    input.multiple = false
    input.onchange = e => {
        resolve(e.target.files[0])
        e.target.remove()
    }
    input.click()
    //document.body.removeChild(input);
})

export const URLtoImage = url => new Promise((resolve, reject) => {
    const image = new window.Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject()
    image.src = url
})

export const fitToWidth = target => container => {
    const { naturalWidth, naturalHeight } = target
    const { width: containerWidth } = container

    const targetAspectRatio = naturalWidth / naturalHeight
    const calculatedSize = {}
    calculatedSize.width = containerWidth
    calculatedSize.height = containerWidth / targetAspectRatio
    calculatedSize.scaleX = calculatedSize.width / naturalWidth
    calculatedSize.scaleY = calculatedSize.height / naturalHeight
    return calculatedSize
}