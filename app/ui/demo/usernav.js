"use client"

import { Fragment } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import clsx from 'clsx'
import Link from 'next/link'

const items = [
    { name: 'Contact us', href: '#' },
]

export default function UserNavigation() {
    return (
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
                {items.map((item) => (
                    <Menu.Item key={item.name}>
                        {({ active }) => (
                            <Link
                                href={item.href}
                                className={clsx(
                                    'block px-3 py-1 text-sm leading-6 text-gray-900',
                                    {
                                        'bg-gray-50': active,
                                    },
                                )}
                            >
                                {item.name}
                            </Link>
                        )}
                    </Menu.Item>
                ))}
            </Menu.Items>
        </Transition>
    )
}