"use client"
import Nav from "@/app/ui/demo/panelLeft/nav"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import FindBlackboard from "@/app/ui/demo/panelLeft/findBlackboard"
import GetNote from "@/app/ui/demo/panelLeft/getNote"
import { gotoTab, setDisabledTabs } from "@/app/lib/redux/tabSlice"

const tabs = [
    { id: "blackboard", label: "Blackboard", component: <FindBlackboard /> },
    { id: "getNote", label: "Get Note", component: <GetNote /> },
]

export default function Panel() {
    const dispatch = useDispatch()
    const currentTab = useSelector(({ tabs }) => tabs.value)
    const disabledTabs = useSelector(({ tabs }) => tabs.disabled)
    const extractedURL = useSelector(({ data }) => data.url)
    
    const handleChange = (_, value) => {
        dispatch(gotoTab(value))
    }

    useEffect(() => {
        if (extractedURL) dispatch(gotoTab(1))
    }, [extractedURL])

    return (
        <div className="flex flex-col rounded-lg bg-white shadow h-full w-full">
            <div className="px-4 pt-2 flex-none">
                <Nav items={tabs} current={currentTab} onChange={handleChange} disabledTabs={disabledTabs} />
            </div>
            <div className="px-4 py-4 flex-1">
                {tabs.map(({ component }, i) => (
                    <SubPanel current={currentTab} key={i} index={i}>{component}</SubPanel>
                ))}
            </div>
        </div>
    )
}

function SubPanel({ children, current, index }) {
    const isCurrent = index === current
    return (
        <div className="contents" hidden={!isCurrent}>
            {isCurrent && children}
        </div>
    )
}