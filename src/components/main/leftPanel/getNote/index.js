import { useRef, useState, useEffect } from 'react'
import ExtractionView from './extractionView'
import XYController from './XYController'
import ToNotePad from './toNotepad'
import { readResponse } from '../../../utilities/misc'
import { sendParameters } from '../../../utilities/fetch'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress';

export default function GetNote({ receiveImage, onConfirm, onParameterChange }) {
    const [cropToggle, toggleCrop] = useState(false)
    const [position, setPosition] = useState({ x: 1000, y: 300 })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (position.x != 1000 && position.y != 300) {
            setIsLoading(true)
            sendParameters(position, { width: 1890, height: 584 })
                .catch(console.log)
                .then(readResponse)
                .then(dataURL => {
                    onParameterChange(dataURL)
                    setIsLoading(false)
                })
        }

    }, [position])

    return (
        <>
            <div className='flex-auto h-1/2'>
                <ExtractionView
                    imageURL={receiveImage}
                    cropToggle={cropToggle}
                    onCrop={onConfirm}
                />
            </div>
            <div className="w-full">
                <div className='h-fit'>
                    <XYController
                        onChange={setPosition}
                        position={position}
                    />
                </div>
                
                {isLoading &&
                    <Box sx={{ width: '100%' }} >
                        <LinearProgress />
                    </Box>
                }
                <ToNotePad
                    onConfirm={() => {
                        toggleCrop(!cropToggle)
                    }}
                />
            </div>
        </>
    )
}