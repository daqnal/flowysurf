import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import "./App.css";

import Home from "./pages/Home";
import Board from "./pages/Map";
import Settings from "./pages/Settings";
import Toasts from "./components/Toasts";

export default function App() {
  const pages = [Home, Board, Settings];

  const [pageIndex, setPageIndex] = useState(2);

  const ActiveComponent = pages[pageIndex];

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={pageIndex}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.22 }}
        >
          <ActiveComponent setPageIndex={setPageIndex} />
        </motion.div>
      </AnimatePresence>
      <Toasts />
    </>
  );
}
