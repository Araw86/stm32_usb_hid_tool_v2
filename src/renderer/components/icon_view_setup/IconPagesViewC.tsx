import React from 'react';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import Box from '@mui/material/Box';

import { useSelector } from 'react-redux';
import { RootState } from '../../store/storeRenderer';

import { store } from '../../store/storeRenderer';
import { setActiveConfigPageId } from '../../../shared/redux/slices/iconStateSlice';

type Props = {};

const IconPagesViewC = (props: Props) => {
  const nPageChangeCounter: number = useSelector(
    (state: RootState) => state.iconStateSlice.nPageChangeCounter
  );
  console.log('IconPagesViewC render count: ' + nPageChangeCounter);

  const oIconPages = useSelector(
    (state: RootState) => state.iconStateSlice.oIconPages
  );

  const treeItems: TreeViewBaseItem[] = React.useMemo(
    () => generateTreeItems(),
    [oIconPages, nPageChangeCounter]
  );

  function generateTreeItems() {
    const aTreeItems: TreeViewBaseItem[] = [];
    aTreeItems[0] = { id: '0', label: oIconPages[0].sPageName, children: [] };
    if (oIconPages[0].aPages.length > 0) {
      aTreeItems[0].children = generateChildren(0);
    }

    return aTreeItems;

    function generateChildren(pageId: number) {
      const children: TreeViewBaseItem[] = [];
      for (let i = 0; i < oIconPages[pageId].aPages.length; i++) {
        const childId = oIconPages[pageId].aPages[i];
        const childPage = oIconPages[childId];

        children.push({
          id: `${childId}`,
          label: childPage.sPageName,
          children: [],
        });
        if (childPage.aPages.length > 0) {
          children[i].children = generateChildren(childId);
        }
      }
      return children;
    }
  }

  const fOnItemClick = (itemId: number) => {
    console.log(treeItems);
    console.log('Selected page: ' + itemId);
    store.dispatch(setActiveConfigPageId(itemId));
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <RichTreeView
        items={treeItems}
        onItemClick={(event, itemId) => fOnItemClick(parseInt(itemId))}
      />
    </Box>
  );
};

export default IconPagesViewC;
