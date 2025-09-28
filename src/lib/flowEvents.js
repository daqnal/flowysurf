const listeners = new Set();

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function emit(payload) {
  for (const fn of Array.from(listeners)) {
    try {
      fn(payload);
    } catch (e) {
      // ignore
    }
  }
}

export default { subscribe, emit };
