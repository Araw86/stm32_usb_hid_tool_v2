import { store } from '../../store/storeRenderer';

const refs = new Map<number, HTMLSpanElement>();
let rafPending = false;

export function registerAnalogRef(keyId: number, el: HTMLSpanElement | null): void {
  if (el) refs.set(keyId, el);
  else refs.delete(keyId);
}

store.subscribe(() => {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(() => {
    rafPending = false;
    const values = store.getState().keyboardKeysStateSlice.aKeyAnalogState;
    refs.forEach((el, keyId) => {
      const v = String(values[keyId]);
      if (el.textContent !== v) el.textContent = v;
    });
  });
});
