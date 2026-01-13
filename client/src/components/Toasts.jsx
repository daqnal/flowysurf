import { useState, useEffect } from "react";

let pushFn = null;

export function pushToast(message, type = "info", timeout = 3000) {
  if (pushFn) pushFn({ id: Date.now(), message, type, timeout });
}

export default function Toasts() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    pushFn = (t) => setToasts((s) => [...s, t]);
    return () => {
      pushFn = null;
    };
  }, []);

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((t) =>
      setTimeout(() => {
        setToasts((s) => s.filter((x) => x.id !== t.id));
      }, t.timeout)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts]);

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`alert shadow-lg ${
            t.type === "error" ? "alert-error" : t.type === "success" ? "alert-success" : "alert-info"
          }`}
        >
          <div>
            <span>{t.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
