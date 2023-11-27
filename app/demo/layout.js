"use client"
import Nav from "@/app/ui/demo/topnav"
import { Provider, useSelector } from "react-redux"
import store from "../lib/redux/store"
import dynamic from "next/dynamic"


function Layout({ children }) {

    // const mq = window.matchMedia("(min-width: 1024px)")
    // mq.onchange = e => {console.log(e)}
    //mq.matches ? console.log('is lg') : console.log('is not lg')

    return (
        <Provider store={store}>
            <div className="flex h-screen flex-col">
                <div className=" sticky w-screen top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <Nav />
                </div>
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </Provider>
    )
}
export default dynamic(() => Promise.resolve(Layout), {ssr: false})