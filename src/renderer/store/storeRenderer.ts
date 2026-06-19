import { stateSyncEnhancer } from 'electron-redux/renderer';
import { configureStore } from '@reduxjs/toolkit';

import { reducers } from '../../shared/redux/combinedReducer';
import { recordSamples } from '../components/keyboard_layout/keyHistoryStore';

//middleware stateSyncEnhancer to share redux store in renderer and main
export const store = configureStore({
  reducer: reducers,
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers({
      autoBatch: false,
    }).concat(stateSyncEnhancer()),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

let lastAnalogRef: number[] | null = null;
store.subscribe(() => {
  const arr = store.getState().keyboardKeysStateSlice.aKeyAnalogState;
  if (arr !== lastAnalogRef) {
    lastAnalogRef = arr;
    recordSamples(arr);
  }
});
