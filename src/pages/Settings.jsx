import { Home } from "lucide-react";
import { useEffect, useState } from "react";

const DEFAULT_KEYBINDS = {
  delete: ["d", "Delete", "Backspace"],
  task: ["q"],
  milestone: ["w"],
};

export default function Settings({ setPageIndex }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem("flowymap-theme");
      if (stored) return stored;
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "night" : "emerald";
    } catch (e) {
      return "emerald";
    }
  });

  const [keybinds, setKeybinds] = useState(() => {
    try {
      const raw = localStorage.getItem("flowymap-keybinds");
      return raw ? JSON.parse(raw) : DEFAULT_KEYBINDS;
    } catch (e) {
      return DEFAULT_KEYBINDS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("flowymap-theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem("flowymap-keybinds", JSON.stringify(keybinds));
    } catch (e) {
      // ignore
    }
  }, [keybinds]);

  function goHome() {
    if (typeof setPageIndex === "function") {
      setPageIndex(0);
      return;
    }
    // fallback
    history.back();
  }

  function updateKeybind(action, index, value) {
    setKeybinds((prev) => {
      const next = { ...prev };
      next[action] = Array.isArray(next[action]) ? [...next[action]] : [];
      next[action][index] = value;
      return next;
    });
  }

  function addKeybind(action) {
    setKeybinds((prev) => ({ ...prev, [action]: [...(prev[action] || []), ""] }));
  }

  function removeKeybind(action, index) {
    setKeybinds((prev) => {
      const next = { ...prev };
      next[action] = (next[action] || []).filter((_, i) => i !== index);
      return next;
    });
  }

  return (
    <ul className="list bg-base-300 rounded-box shadow-md m-12">
      <li className="list-row flex w-full items-center justify-between">
        <div className="font-bold text-lg">Settings</div>
        <div className="tooltip tooltip-left" data-tip="Return Home">
          <button className="btn btn-soft btn-primary btn-sm btn-circle" onClick={goHome}>
            <Home className="w-5" />
          </button>
        </div>
      </li>

      <li className="list-row flex w-full items-center justify-between">
        <div className="font-medium">Theme</div>
        <div className="join">
          <input
            type="radio"
            name="theme-buttons"
            className="btn theme-controller join-item"
            aria-label="Default"
            value="default"
            defaultChecked />
          <input
            type="radio"
            name="theme-buttons"
            className="btn theme-controller join-item"
            aria-label="Emerald"
            value="emerald" />
          <input
            type="radio"
            name="theme-buttons"
            className="btn theme-controller join-item"
            aria-label="Night"
            value="night" />
          <input
            type="radio"
            name="theme-buttons"
            className="btn theme-controller join-item"
            aria-label="Nord"
            value="nord" />
          <input
            type="radio"
            name="theme-buttons"
            className="btn theme-controller join-item"
            aria-label="Dracula"
            value="dracula" />
        </div>
      </li>

      <li className="list-row">
        <div className="w-full">
          <div className="font-medium mb-2">Keybinds</div>

          <div className="grid gap-2">
            {Object.entries(keybinds).map(([action, keys]) => (
              <div key={action} className="card bg-base-100 p-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="capitalize">{action}</div>
                  <div>
                    <button
                      className="btn btn-xs btn-outline mr-2"
                      onClick={() => addKeybind(action)}>
                      + Add
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {(keys || []).map((k, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        className="input input-sm w-full"
                        value={k}
                        onChange={(e) => updateKeybind(action, i, e.target.value)}
                        aria-label={`${action} key ${i}`}
                      />
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => removeKeybind(action, i)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </li>

      <li className="list-row">
        <div className="flex w-full justify-end gap-2">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => {
              // restore defaults
              setKeybinds(DEFAULT_KEYBINDS);
            }}>
            Restore defaults
          </button>
        </div>
      </li>
    </ul>
  );
}
