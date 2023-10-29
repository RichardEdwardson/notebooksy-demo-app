import React, { useState, forwardRef, useEffect } from "react";
import "./GetNote.css";
import FindBlackboard from './FindBlackboard';
import ExtractionEditor from './ExtractionEditor';

export default function GetNote({ send }) {
    const [extracted, setExtracted] = useState(null)
    return (
        <div className="container">
            <FindBlackboard
                onFinish={extracted => {
                    setExtracted(extracted)
                }}
                onNewImage={() => {
                    setExtracted(null)
                }}
            />
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
