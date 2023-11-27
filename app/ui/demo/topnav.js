"use client"

import { Menu } from '@headlessui/react'
import UserNav from "@/app/ui/demo/usernav"
import Image from 'next/image'

export default function Topbar() {
    return (
        <>
            <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-0">
                    <span className="sr-only">Open user menu</span>
                    <Image
                        className="h-10 w-10 rounded-full bg-gray-50"
                        src="/notebooksy.png"
                        alt=""
                        width={500}
                        height={500}
                    />
                </Menu.Button>
                <UserNav />
            </Menu>
            {/* Separator mobile */}
            {/* <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" /> */}
            {/* Separator desktop*/}
            {/* <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" /> */}
            <div className="min-w-0 flex-auto">
                <h2 className="text-3xl font-bold leading-7 text-gray-800 sm:truncate sm:text-3xl sm:tracking-tight">
                    Notebooksy
                </h2>
            </div>
        </>
    )
}