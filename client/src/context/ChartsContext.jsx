import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const ChartsContext = createContext();

export function ChartsProvider({ children }) {
    const { user } = useAuth();
    const [charts, setCharts] = useState([]);
    const [chart, setChart] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchCharts();
        } else {
            setCharts([]);
            setLoading(false);
        }
    }, [user]);

    const fetchCharts = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/charts", { withCredentials: true });
            setCharts(res.data);
        } catch (err) {
            console.error("Failed to fetch charts", err);
            setCharts([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchChart = async (id) => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/charts/${id}`);
            setChart(res.data);
        } catch (err) {
            console.error("Failed to fetch chart", err);
            setChart(null);
        } finally {
            setLoading(false);
        }
    }

    const addChart = async (data) => {
        try {
            const res = await axios.post("/api/charts", { data }, { withCredentials: true });
            setCharts([...charts, res.data]);
        } catch (err) {
            console.error("Failed to add chart", err);
        }
    };

    return (
        <ChartsContext.Provider value={{ chart, charts, loading, addChart, fetchCharts, fetchChart }}>
            {children}
        </ChartsContext.Provider>
    );
}

export const useCharts = () => useContext(ChartsContext);