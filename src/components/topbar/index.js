import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'

const userNavigation = [
    { name: 'Contact us', href: '#' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


export default function Topbar() {
    return (
        <>
            <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <img
                        className="h-8 w-8 rounded-full bg-gray-50"
                        src="/notebooksy.png"
                        alt=""
                    />
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute left-0 z-10 mt-2.5 w-32 origin-top-left rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                                {({ active }) => (
                                    <a
                                        href={item.href}
                                        className={classNames(
                                            active ? 'bg-gray-50' : '',
                                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                                        )}
                                    >
                                        {item.name}
                                    </a>
                                )}
                            </Menu.Item>
                        ))}
                    </Menu.Items>
                </Transition>
            </Menu>
            {/* Separator mobile */}
            <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />
            {/* Separator desktop*/}
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />
            <div className="min-w-0 flex-auto">
                <h2 className="text-2xl font-bold leading-7 text-gray-800 sm:truncate sm:text-3xl sm:tracking-tight">
                    Notebooksy
                </h2>
            </div>
        </>
    )
}