import axios from 'axios'

const API_URL = "https://demo-e6yosmbikq-nn.a.run.app"


// export async function getExtracted(file, points, onLoad, callback) {
//     onLoad(true)
//     const formData = new FormData();
//     formData.append("file", file)
//     try {
//         const res = await axios.post(`${API_URL}/upload/image/`, formData)
//     } catch (e) {
//         console.log(e)
//     }
//     axios
//         .post(`${API_URL}/upload/points/`, points, { responseType: "blob" })
//         .then(res => {
//             const reader = new FileReader()
//             reader.readAsDataURL(res.data)
//             reader.onload = () => {
//                 callback(reader.result)
//                 onLoad(false)
//             }
//         })
//         .catch(e => {
//             console.log(e)
//         })
// }

// export const getExtracted = async (file, pts) => {
//     const points = pts.map(pt => ({left: pt.x, top: pt.y }))
//     const formData = new FormData();
//     const reader = new FileReader()
//     formData.append("file", file)
//     try {
//         const res = await axios.post(axios.post(`${API_URL}/upload/image/`, formData))
//     } catch (e) {
//         console.log(e)
//     }
//     try {
//         const res = await axios.post(`${API_URL}/upload/points/`, points, { responseType: "blob" })
//     } catch (e) {
//         console.log(e)
//     }
//     return new Promise((resolve, reject) => {
//         reader.readAsDataURL(res.data)
//         reader.onload = () => resolve(reader.result)
//         reader.onerror = e => reject(e)
//     })
// }

export const sendImageFile = file => {
    const formData = new FormData();
    formData.append("file", file)
    return axios.post(`${API_URL}/upload/image/`, formData)
}

export const sendPoints = pts => {
    const points = pts.map(pt => ({ left: pt.x, top: pt.y }))
    return axios.post(`${API_URL}/upload/points/`, points, { responseType: "blob" })
}

export const sendParameters = ({ x, y }, { width, height }) => {
    const pars = {
        blockSize: [x, width],
        offset: [y, height],
    }
    return axios.post(`${API_URL}/upload/pars/`, pars, { responseType: "blob" })
}