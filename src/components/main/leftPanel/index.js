import { useState, useRef, useEffect } from "react"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BlackboardLocator from './poly'
import { CheckCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/20/solid'
import PolySelector from "../../utilities/polySelector";
import demo from "./assets/demo.jpeg"
import GetNote from './getNote'
import { sendImageFile, sendPoints } from "../../utilities/fetch";
import { readResponse } from "../../utilities/misc";
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress';


export default function LeftPanel({ inputImage, onGetNote }) {
    const [isInitial, setIsInitial] = useState(true)
    const [extracted, setExtracted] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(0)
    const [points, setPoints] = useState([])

    const handleClick = () => {
        setIsLoading(true)
        sendImageFile(inputImage.file)
            .catch(console.log)
            .then(() => sendPoints(points))
            .catch(console.log)
            .then(res => readResponse(res))
            .catch(console.log)
            .then(dataURL => {
                setExtracted(dataURL)
                setIsLoading(false)
            })
    }

    useEffect(() => {
        if (inputImage.url != demo) {
            setPage(0)        
        }    
    }, [inputImage])

    useEffect(() => {
        if (extracted) {
            setPage(1)
            setIsInitial(false)
        }
    }, [extracted])

    return (
        <>
            <div className="flex flex-col divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mx-5 my-5 grow">
                <div className="px-4 py-2 sm:px-6">
                    <Topbar
                        current={page}
                        onChange={setPage}
                        //isInitial={inputImage.file == null}
                        isInitial={isInitial}
                    />
                </div>
                <div className="px-4 py-5 sm:p-6 overflow-hidden flex-1">
                    <div className="flex flex-col max-h-full h-full w-full overflow-auto">
                        {page == 0 && (
                            <>
                            <div className="h-full">
                                    <PolySelector
                                        imageURL={inputImage.url}
                                        points={points}
                                        onPointsMove={setPoints}
                                    />
                                    {isLoading &&
                                        <Box sx={{ width: '100%' }} >
                                            <LinearProgress />
                                        </Box>
                                    }

                            </div>
                                
                                <button
                                    type="button"
                                    className="flex flex-row-reverse w-full items-center gap-x-2 bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    onClick={handleClick}
                                >
                                    <ArrowRightCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                                    Extract Blackboard Content
                                </button>
                            </>
                        )}
                        {page == 1 && (

                            <GetNote 
                                receiveImage={extracted}
                                onConfirm={onGetNote}
                                onParameterChange={setExtracted}
                            />

                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

const Topbar = ({ isInitial, onChange, current }) => {
    //const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        onChange(newValue);
    };

    return (
        <>
            <Tabs value={current} onChange={handleChange} aria-label="tabs">
                <Tab label="Blackboard" />
                <Tab label="Get note" disabled={isInitial} />
            </Tabs>
        </>
    )


}
