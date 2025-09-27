import { useState } from "react";
import "./App.css";

import Home from "./pages/Home";
import Board from "./pages/Map";
import Settings from "./pages/Settings";

export default function App() {
  const pages = [Home, Board, Settings];

  const [pageIndex, setPageIndex] = useState(1);

  const ActiveComponent = pages[pageIndex];

  return (
    <>
      <ActiveComponent setPageIndex={setPageIndex} />
    </>
  );
}
