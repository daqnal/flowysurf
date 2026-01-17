import { Home } from "lucide-react"

export default function Drive({ setPageIndex }) {
    return (
        <div className="bg-base-300 rounded-box shadow-md m-12 p-6">
            <div className="flex w-full justify-between">
                <div className="font-bold text-lg">Drive</div>
                <div className="tooltip tooltip-left" data-tip="Return Home">
                    <button className="btn btn-soft btn-primary btn-sm btn-circle" onClick={() => setPageIndex(0)}>
                        <Home className="w-5" />
                    </button>
                </div>
            </div>


        </div>
    )
}