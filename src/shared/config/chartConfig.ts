/**
 * Global chart settings for the per-key analog history dialog.
 * Edit here to retune the chart for all keys at once.
 */

// Y-axis bounds for the analog value plot.
// Defaults match a typical 12-bit STM32 ADC (0..4095).
export const KEY_ANALOG_MIN = 2000;
export const KEY_ANALOG_MAX = 3200;

// X-axis window length, in milliseconds.
export const HISTORY_WINDOW_MS = 10_000;
