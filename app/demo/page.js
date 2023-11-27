import PanelLeft from "@/app/ui/demo/panelLeft"
import PanelRight from "@/app/ui/demo/panelRight"


export default function Page() {

    return (
        <div className="flex flex-row w-screen h-full">
            <div className="hidden w-0 lg:block lg:basis-1/2 bg-slate-400 px-5 py-5">
                <PanelLeft />
            </div>
            <div className="flex-1 w-0 px-2 md:px-0 lg:basis-1/2 bg-slate-400">
                <PanelRight />   
            </div>
        </div>
    )
}
