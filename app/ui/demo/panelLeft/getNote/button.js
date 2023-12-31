import { CheckCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/20/solid'

export default function ButtonContinue({ onClick }) {
    return (
        <>
            <button
                type="button"
                className="flex flex-row-reverse w-full items-center gap-x-2 bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={onClick}
            >
                <ArrowRightCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                To Notepad
            </button>
        </>
    )
}