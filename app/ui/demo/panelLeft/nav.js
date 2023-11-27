"use client"

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export default function BasicTabs({ items, current, onChange, disabledTabs }) {

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={current} onChange={onChange}>
                {items.map(({ label, id }, i) => (
                    <Tab 
                    key={i}
                    label={label} 
                    id={`tab-${id}`} 
                    disabled={disabledTabs.some(index => (index == i))}
                    />
                ))}
            </Tabs>
        </Box>
    );
}