import { useCharts } from "../context/ChartsContext";

import { Home, Map, Plus } from "lucide-react";
import { loadChartServer } from "./Map.jsx";

export default function Drive({ setPageIndex }) {
    const { charts, chart, fetchChart } = useCharts();

    const handleChartClick = (id) => {
        fetchChart(id);
        setPageIndex(1);
        loadChartServer(chart);
    }


    return (
        <div className="h-full w-full p-12">
            <div className="flex flex-col h-full bg-base-300 rounded-box shadow-md p-6">
                <div className="flex w-full justify-between">
                    <div>
                        <span className="font-bold text-xl">Drive</span>
                    </div>
                    <div className="tooltip tooltip-left" data-tip="Return Home">
                        <button className="btn btn-soft btn-primary btn-sm btn-circle" onClick={() => setPageIndex(0)}>
                            <Home className="w-5" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-grow">
                    {charts.length !== 0 ? (
                        <div className="flex flex-col w-full">
                            <div className="my-2 flex-0">
                                <button className="btn btn-sm btn-primary" onClick={() => setPageIndex(1)}>
                                    <Plus className="w-4" />
                                    <span>Create new map</span>
                                </button>
                            </div>

                            <ul className="flex flex-col p-3 flex-1 h-full bg-base-100 rounded-box gap-2 overflow-auto">
                                {charts.map(chart => (
                                    <li className="flex" key={chart.id}>
                                        <button className="btn w-full flex" onClick={() => handleChartClick(chart.id)}>
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
                        </div>

                    ) : (
                        <div>
                            <h2>No maps created yet</h2>
                            <button className="btn" onClick={() => setPageIndex(1)}>Create new map</button>
                        </div>
                    )}
                </div>
            </div>
        </div>

    )
}
