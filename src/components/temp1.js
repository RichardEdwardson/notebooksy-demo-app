import React, { useState } from 'react';

export default function SplitScreen() {
    const [size, setSize] = useState()
    return (
        <div style={{ width: "100%" }}>
            <div style={{
                float: "left",
                width: "49.5%",
                backgroundColor: "red",
                height: "100vh",
            }}>
                <h1>Hello</h1>
            </div>
            <div
                style={{
                    float: "left",
                    height: "100vh",
                    width: "1%",
                    backgroundColor: "black",
                }}
                onClick={e => {console.log(e.target.style.width)}}></div>
            <div style={{
                float: "left",
                width: "49.5%",
                backgroundColor: "blue",
                height: "100vh",
            }}>
                <h1>World</h1>
            </div>
        </div>
    )
}