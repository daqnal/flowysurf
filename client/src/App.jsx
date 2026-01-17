import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { KeyBindProvider } from "react-keybinds";
import { AuthProvider } from "./context/AuthContext";

import "./App.css";

import Home from "./pages/Home";
import Board from "./pages/Map";
import Settings from "./pages/Settings";
import Drive from "./pages/Drive";
import Toasts from "./components/Toasts";

export default function App() {

  const pages = [Home, Board, Settings, Drive];

  const [pageIndex, setPageIndex] = useState(0);

  const ActiveComponent = pages[pageIndex];

  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <motion.div
          key={pageIndex}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.22 }}
        >
          <KeyBindProvider debounce={300}>
            <ActiveComponent setPageIndex={setPageIndex} />
          </KeyBindProvider>
        </motion.div>
      </AnimatePresence>
      <Toasts />
    </AuthProvider>
  );
}
