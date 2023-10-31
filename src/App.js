import 'split-pane-react/esm/themes/default.css';
import React, { useState, useRef, useEffect } from 'react';
import SplitPane, { Pane } from 'split-pane-react';
import Right from './components/Right';
import Left from './components/Left';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import BottomNavigation from '@mui/material/BottomNavigation';

function App() {
  const [sizes, setSizes] = useState([]);
  const [imageTransfer, setImageTransfer] = useState(null);

  return (
    <div
      className="flex"
    >
      <div
        className="w-full h-screen overflow-scroll"
      >
        <Left
          send={setImageTransfer}
        />
      </div>
      <div
        className="w-full h-screen"
      >
        
        <Right
          receive={imageTransfer}
        />
        <AppBar
          position="static"
        >
          <Button color="inherit">Login</Button>
        </AppBar>
      </div>
    </div>
  );
}


export default App;
