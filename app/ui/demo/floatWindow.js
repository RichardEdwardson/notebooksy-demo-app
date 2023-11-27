import { Transition, Dialog } from '@headlessui/react'
const FloatWindow = ({ show, onClose }) => {
    return (
        <Dialog
            open={show}
            onClose={() => onClose(false)
            }
            className="relative z-10"
        >
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <Dialog.Panel className="w-full h-1/2 max-w-sm rounded bg-black">
                    <Dialog.Title>Complete your order</Dialog.Title>

                    {/* ... */}
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}