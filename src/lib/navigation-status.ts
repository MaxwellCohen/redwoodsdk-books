import { useSyncExternalStore } from 'react';

let pending = false;
const listeners = new Set<() => void>();

export function setNavigationPending(next: boolean) {
  if (pending === next) return;
  pending = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useNavigationStatus() {
  return {
    pending: useSyncExternalStore(
      subscribe,
      () => pending,
      () => false,
    ),
  };
}
