import { useCharts } from "../context/ChartsContext";

import { Home, Map } from "lucide-react"

export default function Drive({ setPageIndex }) {
    const { charts } = useCharts();


    return (
        <div className="h-full w-full p-12">
            <div className="h-full bg-base-300 rounded-box shadow-md p-6">
                <div className="flex w-full justify-between">
                    <div className="font-bold text-lg">Drive</div>
                    <div className="tooltip tooltip-left" data-tip="Return Home">
                        <button className="btn btn-soft btn-primary btn-sm btn-circle" onClick={() => setPageIndex(0)}>
                            <Home className="w-5" />
                        </button>
                    </div>
                </div>

                <div>
                    {charts.length !== 0 ? (
                        <ul className="list">
                            {charts.map(chart => (
                                <li className="list-row flex" key={chart.id}>
                                    <button className="btn w-full flex">
                                        <span className="flex-grow text-left font-bold flex place-items-center gap-2">
                                            <span><Map className="w-4 inline" /></span>
                                            <span>{chart.name}</span>
                                        </span>
                                        <span className="flex-grow text-xs text-right opacity-50">
                                            {new Date(chart.dateCreated).toDateString()}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>
                            <h2>No maps created yet</h2>
                            <button className="btn">Create new map</button>
                        </div>
                    )}
                </div>
            </div>
        </div>

    )
}
