import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { red } from '@mui/material/colors';

const actions = [
    { icon: <EditIcon />, name: 'Take Note', on: 'onTakeNote' },
    { icon: <SaveIcon />, name: 'Save', on: 'onSave' },
    { icon: <DeleteForeverIcon sx={{ color: red[400] }} />, name: 'Clear', on: 'onClear' },
];

export default function BasicSpeedDial({ onTakeNote, onSave, onClear }) {
    return (
        <>
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.on}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={eval(action.on)}
                    />
                ))}
            </SpeedDial>
        </>
    );
}