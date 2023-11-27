import axios from 'axios'
import { dataURLtoFile } from './utils';

const API_URL = "https://demo-e6yosmbikq-nn.a.run.app"

export const fetchImage = dataURL => {
    const name = new Date().getTime()
    const file = dataURLtoFile(dataURL, name)
    const formData = new FormData();
    formData.append("file", file)
    return axios.post(`${API_URL}/upload/image/`, formData)
}

export const fetchPoints = pts => {
    const points = pts.map(pt => ({ left: pt.x, top: pt.y }))
    return axios.post(`${API_URL}/upload/points/`, points, { responseType: "blob" })
}

export const fetchParameters = ({ x, y }, { width, height }) => {
    const pars = {
        blockSize: [x, width],
        offset: [y, height],
    }
    return axios.post(`${API_URL}/upload/pars/`, pars, { responseType: "blob" })
}
