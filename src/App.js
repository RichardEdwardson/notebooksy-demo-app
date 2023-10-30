import 'split-pane-react/esm/themes/default.css';
import React, { useState, useRef, useEffect } from 'react';
import SplitPane, { Pane } from 'split-pane-react';
import Right from './components/Right';
import Left from './components/Left';

function App() {
  //const [sizes, setSizes] = React.useState([100, '8%', 'auto']);
  const [sizes, setSizes] = useState([]);
  const canvasRef = useRef(null)
  const [imageTransfer, setImageTransfer] = useState(null);

  // useEffect(() => {
  //   console.log(imageTransfer.content)

  // }, [imageTransfer])



  const layoutCSS = {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div style={{ height: '100vh' }}>
      <SplitPane
        split='vertical'
        sizes={sizes}
        onChange={setSizes}
      >
        <Pane minSize='20%' maxSize='80%'>
          <div style={{ ...layoutCSS, background: '#ddd' }}>
            <Left send={setImageTransfer}
            />
          </div>
        </Pane>
        <Pane minSize='20%' maxSize='80%'>
          <div style={{ ...layoutCSS, background: '#d5d7d9', overflowY: "scroll" }}>
            <Right
              receive={imageTransfer}
            />
          </div>
        </Pane>
      </SplitPane>
    </div>
  );
}


export default App;
