import React, { useState } from "react";
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import FindBlackboard from './FindBlackboard';
import ExtractionEditor from './ExtractionEditor';
//test
export default function GetNote({ send }) {
    const [extracted, setExtracted] = useState(null)
    return (
        <div
            className="grid gap-y-2"
        >
            <Box sx={{ width: '100%' }}
                align="center"
            >
                <Typography variant="h3" gutterBottom>
                    Notebooksy
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Contact: notebooksy@bbnote.ca
                </Typography>
                <Typography variant="body1" gutterBottom>
                    (Click on 4 corners of a blackboard to begin)
                </Typography>
            </Box>
            <div
                className="overflow-hidden rounded-lg bg-white shadow"
            >
                <div
                    className="px-4 py-5 sm:p-6"
                >
                    <FindBlackboard
                        onFinish={extracted => {
                            setExtracted(extracted)
                        }}
                        onNewImage={() => {
                            setExtracted(null)
                        }}
                    />
                </div>
            </div>
            {extracted != null &&
                <ExtractionEditor
                    send={send}
                    receive={extracted}
                    onNewPar={setExtracted}
                />
            }
        </div>
    );
};
