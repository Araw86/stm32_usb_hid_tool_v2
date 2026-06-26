import Store from 'electron-store';

import { store } from './store/mainStore';

import {
  IconStateInterface,
  setActiveIcons,
  setAllIcons,
} from '../shared/redux/slices/iconStateSlice';
import { ICON_GRID_SIZE } from '../shared/config/iconGridConfig';

import { IMAGE_ARRAY_LENGTH } from '../shared/config/imageArrayConf';

import imageFileReader from './imageFileReader';
import { getUserDatabaseDir, seedDefaultIcons } from './iconPaths';

const electronStore = new Store({
  name: 'storeIconState',
  cwd: getUserDatabaseDir(),
});

export function initStoreIcons() {
  seedDefaultIcons();

  const saved: string[] = Array(IMAGE_ARRAY_LENGTH).fill('');
  const stoiredValue = electronStore.get('iconState');
  console.log('load estore');
  console.log(stoiredValue);
  const iconState = store.getState().iconStateSlice;
  if (stoiredValue === undefined) {
    electronStore.set('iconState', JSON.stringify(iconState));
  } else {
    const parsed = JSON.parse(stoiredValue as string) as IconStateInterface;
    const firstPage = Object.values(parsed.oIconPages)[0];
    const storedSlotCount = firstPage?.aIcons?.length ?? 0;
    if (storedSlotCount !== ICON_GRID_SIZE) {
      console.log(`Icon grid changed (stored ${storedSlotCount} → ${ICON_GRID_SIZE}), discarding saved state`);
      electronStore.set('iconState', JSON.stringify(iconState));
    } else {
      store.dispatch(setActiveIcons(parsed));
    }
  }
  console.log(saved);
  refreshIconList();
}

export function refreshIconList(): string[] {
  const aIconsOnDisk = imageFileReader.aListImages();
  console.log(aIconsOnDisk);
  store.dispatch(setAllIcons(aIconsOnDisk));
  return aIconsOnDisk;
}

function storeActiveIcons() {
  const iconState = store.getState().iconStateSlice;
  electronStore.set('iconState', JSON.stringify(iconState));
}

const storeIcons = { initStoreIcons, storeActiveIcons, refreshIconList };

export default storeIcons;
