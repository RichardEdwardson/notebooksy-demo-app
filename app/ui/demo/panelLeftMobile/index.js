import { Fragment, useState } from "react"
import { Transition, Dialog } from "@headlessui/react"
import FindBlackboard from "@/app/ui/demo/panelLeft/findBlackboard"
import GetNote from "@/app/ui/demo/panelLeft/getNote"
import { useSelector } from "react-redux"

export default function PanelLeftMobile({ show, onclose }) {
    const currentTab = useSelector(({tabs}) => tabs.value)
    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="absolute z-50 w-full h-full" onClose={() => { }}>
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900/80" />
                </Transition.Child>
                <div className="fixed inset-0 flex">
                    <Dialog.Panel className="relative flex w-full h-full flex-1 py-10">
                        {currentTab == 0 && (<FindBlackboard />)}
                        {currentTab == 1 && (<GetNote />)}
                    </Dialog.Panel>
                </div>
            </Dialog>
        </Transition.Root>
    )
}