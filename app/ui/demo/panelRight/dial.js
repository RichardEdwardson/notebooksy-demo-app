import EditIcon from '@mui/icons-material/Edit';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { red } from '@mui/material/colors';
import SaveIcon from '@mui/icons-material/Save';
import clsx from 'clsx';

const actions = [
    { icon: <EditIcon />, name: 'Take Note', on: 'onTakeNote' },
    { icon: <SaveIcon />, name: 'Save', on: 'onSave' },
    { icon: <DeleteForeverIcon sx={{ color: red[400] }} />, name: 'Clear', on: 'onClear' },
];

export default function NotepadSpeedDial({ onTakeNote, onSave, onClear, hide }) {
    return (
        <>
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={hide ? {display: "none"} : { position: 'fixed', bottom: 20, right: 20 }}
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