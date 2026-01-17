import { Home } from "lucide-react";
import { useEffect, useState } from "react";
import { themeChange } from "theme-change";

const DEFAULT_KEYBINDS = {
  delete: ["d", "Delete", "Backspace"],
  task: ["q"],
  milestone: ["w"],
};

const KEYBIND_NAMES = {
  delete: "Delete Node",
  task: "Create Task Node",
  milestone: "Create Milestone Node",
};

export default function Settings({ setPageIndex }) {

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [keybinds, setKeybinds] = useState(() => {
    try {
      const raw = localStorage.getItem("flowymap-keybinds");
      return raw ? JSON.parse(raw) : DEFAULT_KEYBINDS;
    } catch (e) {
      return DEFAULT_KEYBINDS;
    }
  });

  useEffect(() => {
    // initialize theme-change bindings
    themeChange(false);

    // apply saved theme from localStorage if present
    try {
      const saved = localStorage.getItem("flowymap-theme");
      if (saved) {
        document.documentElement.setAttribute("data-theme", saved);
        window.flowyTheme = saved;
      } else {
        // ensure window.flowyTheme reflects current or preferred theme
        const cur = document.documentElement.getAttribute("data-theme") || (prefersDark ? "night" : "emerald");
        window.flowyTheme = cur;
      }
    } catch (e) {
      // ignore
    }

    // observe theme changes and persist them
    const root = document.documentElement;
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "data-theme") {
          try {
            const t = root.getAttribute("data-theme");
            if (t) localStorage.setItem("flowymap-theme", t);
            window.flowyTheme = t;
          } catch (e) {
            // ignore
          }
          break;
        }
      }
    });
    try {
      mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    } catch (e) {
      // ignore
    }

    return () => {
      try {
        mo.disconnect();
      } catch (e) { }
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("flowymap-keybinds", JSON.stringify(keybinds));
    } catch (e) {
      // ignore
    }
  }, [keybinds]);
  return (
    <div className="w-full h-full flex justify-center">
      <ul className="list bg-base-300 rounded-box shadow-md m-12 flex-grow lg:max-w-1/2">
        <li className="list-row flex w-full items-center justify-between">
          <div className="font-bold text-lg">Settings</div>
          <div className="tooltip tooltip-left" data-tip="Return Home">
            <button className="btn btn-soft btn-primary btn-sm btn-circle" onClick={() => setPageIndex(0)}>
              <Home className="w-5" />
            </button>
          </div>
        </li>

        <li className="list-row flex w-full items-center justify-between">
          <div className="font-medium">Theme</div>
          <div className="join">
            {(() => {
              // determine current theme (data-theme or saved or prefers)
              let current = "";
              try {
                current = document.documentElement.getAttribute("data-theme") || localStorage.getItem("flowymap-theme") || (prefersDark ? "night" : "emerald");
              } catch (e) {
                current = prefersDark ? "night" : "emerald";
              }
              const themes = [
                { label: "Emerald", value: "emerald", data: "emerald" },
                { label: "Night", value: "night", data: "night" },
                { label: "Nord", value: "nord", data: "nord" },
                { label: "Dracula", value: "dracula", data: "dracula" },
              ];
              return themes.map((t, i) => (
                <input
                  key={i}
                  type="radio"
                  name="theme-buttons"
                  className="btn theme-controller join-item"
                  aria-label={t.label}
                  value={t.value}
                  data-set-theme={t.data}
                  defaultChecked={t.data === current}
                />
              ));
            })()}
          </div>
        </li>
      </ul>
    </div>

  );
}
