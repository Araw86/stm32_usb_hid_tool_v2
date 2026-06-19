import { KEYBOARD_KEYS_LENGTH } from '../../../shared/config/imageArrayConf';
import { HISTORY_WINDOW_MS } from '../../../shared/config/chartConfig';

export { HISTORY_WINDOW_MS };

/**
 * Per-key ring buffer of analog samples. Capacity gives ~50% headroom over
 * the configured window at the 60 Hz coalesced dispatch rate.
 */

const SAMPLE_RATE_HZ = 60;
const CAPACITY = Math.max(
  256,
  Math.ceil((HISTORY_WINDOW_MS / 1000) * SAMPLE_RATE_HZ * 1.5)
);

type Buffer = {
  timestamps: Float64Array;
  values: Uint16Array;
  head: number; // next write index
  count: number; // number of samples written (saturates at CAPACITY)
};

const buffers: Buffer[] = Array.from({ length: KEYBOARD_KEYS_LENGTH }, () => ({
  timestamps: new Float64Array(CAPACITY),
  values: new Uint16Array(CAPACITY),
  head: 0,
  count: 0,
}));

type Listener = () => void;
const listeners: Map<number, Set<Listener>> = new Map();

export function recordSamples(values: ArrayLike<number>): void {
  const now = performance.now();
  const limit = Math.min(values.length, KEYBOARD_KEYS_LENGTH);
  for (let i = 0; i < limit; i++) {
    const buf = buffers[i];
    buf.timestamps[buf.head] = now;
    buf.values[buf.head] = values[i] & 0xffff;
    buf.head = (buf.head + 1) % CAPACITY;
    if (buf.count < CAPACITY) buf.count++;
  }
  for (const [, set] of listeners) {
    if (set.size === 0) continue;
    for (const fn of set) fn();
  }
}

export type Sample = { t: number; v: number };

/**
 * Returns samples for the given key within the last windowMs, oldest first.
 * Timestamps are absolute (performance.now()).
 */
export function getHistory(
  keyId: number,
  windowMs: number = HISTORY_WINDOW_MS
): Sample[] {
  if (keyId < 0 || keyId >= KEYBOARD_KEYS_LENGTH) return [];
  const buf = buffers[keyId];
  const cutoff = performance.now() - windowMs;
  const out: Sample[] = [];
  const start = (buf.head - buf.count + CAPACITY) % CAPACITY;
  for (let i = 0; i < buf.count; i++) {
    const idx = (start + i) % CAPACITY;
    const t = buf.timestamps[idx];
    if (t < cutoff) continue;
    out.push({ t, v: buf.values[idx] });
  }
  return out;
}

export function subscribe(keyId: number, fn: Listener): () => void {
  let set = listeners.get(keyId);
  if (!set) {
    set = new Set();
    listeners.set(keyId, set);
  }
  set.add(fn);
  return () => {
    const s = listeners.get(keyId);
    if (!s) return;
    s.delete(fn);
    if (s.size === 0) listeners.delete(keyId);
  };
}
