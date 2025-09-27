import { useState } from "react";
import "./App.css";

import Home from "./pages/Home";
import Board from "./pages/Map";
import Settings from "./pages/Settings";
import Toasts from "./components/Toasts";

export default function App() {
  const pages = [Home, Board, Settings];

  const [pageIndex, setPageIndex] = useState(0);

  const ActiveComponent = pages[pageIndex];

  return (
    <>
      <ActiveComponent setPageIndex={setPageIndex} />
      <Toasts />
    </>
  );
}
