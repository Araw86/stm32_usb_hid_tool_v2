import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import exec from 'child_process';
import { ICON_GRID_SIZE } from '../../config/iconGridConfig';


export interface IconPageInterface {
  sPageName: string;
  bIsRootPage: boolean;
  nParentPageId?: number;
  aIcons: number[];
  aPages: number[];
}

export interface IconPageObjectInterface {
    [key: number]: IconPageInterface;
}

export interface IconInterface {
  sIconName: string;
  sIconImagePath: string;
  bIconIsBack: boolean;
  nLinkedPageId: number;
  sIconProgramPath: string;
}

export interface IkonObjectInterface {
    [key: number]: IconInterface;
}

export interface AddIconIconPayloadInterface {
  sIconPosition:number
  sIconName: string;
  sIconImagePath: string;
  bLinkedPage: boolean;
  sIconProgramPath: string;
}
export interface IconStateInterface {
  activeIcons: string[]|null;
  allIcons: string[]|null;

  nActiveConfigPageId:number;

  nActivePageId:number;
  oIconPages: IconPageObjectInterface;
  oIcons: IkonObjectInterface;

  nIdPageGenerator:number;
  nIdIconGenerator:number;

  nPageChangeCounter:number;
}


const initialState: IconStateInterface = {
  /*old*/
  activeIcons: null,
  allIcons: null,
/*new*/

  nActiveConfigPageId:0,

  nActivePageId:0,
  
  oIconPages:{0:{sPageName:"Root",bIsRootPage:true,aIcons:Array(ICON_GRID_SIZE).fill(0),aPages:[]}} as IconPageObjectInterface,
  oIcons:{} as IkonObjectInterface,

  nIdPageGenerator:1,
  nIdIconGenerator:1,
  nPageChangeCounter:0,
}


const iconStateSlice = createSlice({
  name:'iconState',
  initialState,
  reducers:{
    setActiveIcons(slice,action: PayloadAction<IconStateInterface>){
      slice.nActiveConfigPageId=action.payload.nActiveConfigPageId;
      slice.nActivePageId=action.payload.nActivePageId;
      slice.oIconPages=action.payload.oIconPages;
      slice.oIcons=action.payload.oIcons;
      slice.nIdPageGenerator=action.payload.nIdPageGenerator;
      slice.nIdIconGenerator=action.payload.nIdIconGenerator;
      slice.nPageChangeCounter=action.payload.nPageChangeCounter;
      // slice=action.payload;
      console.log(slice)
    },
    setAllIcons(slice,action: PayloadAction<string[]>){
      slice.allIcons=action.payload;
    },
    setIcon(slice,action: PayloadAction<{position:number;icon:string}>){
      slice.activeIcons[action.payload.position]=action.payload.icon;
    },
    setActivePageId(slice,action: PayloadAction<number>){
      slice.nActivePageId=action.payload;
    },
    setActiveConfigPageId(slice,action: PayloadAction<number>){
      slice.nActiveConfigPageId=action.payload;
    },
    addIcon(slice,action: PayloadAction<AddIconIconPayloadInterface>){
      const payload=action.payload;
      /*check if icon already exists*/
      const nActiveConfigPageId=slice.nActiveConfigPageId;
      const oActivePage=slice.oIconPages[nActiveConfigPageId];
      
      const nNewIconId=generateIconId();
      slice.oIcons[nNewIconId]={
        sIconName: payload.sIconName,
        sIconImagePath: payload.sIconImagePath,
        nLinkedPageId: 0,
        sIconProgramPath: payload.sIconProgramPath,
        bIconIsBack: false,
      };
      oActivePage.aIcons[payload.sIconPosition]=nNewIconId;

      function generateIconId(){
        let nNewId:number;
        do{
          nNewId=slice.nIdIconGenerator++;
        }while(slice.oIcons[nNewId]);
        return nNewId;
      }
      if(payload.bLinkedPage){
        const nNewPageId=generatePageId();
        slice.oIconPages[nActiveConfigPageId].aPages.push(nNewPageId);
        slice.oIconPages[nNewPageId]={
          sPageName: payload.sIconName,
          bIsRootPage: false,
          nParentPageId: nActiveConfigPageId,
          aIcons: Array(ICON_GRID_SIZE).fill(0),
          aPages: [],
        }

        slice.oIcons[nNewIconId].nLinkedPageId=nNewPageId;
        slice.nPageChangeCounter++;
        /* back icon */
        const nBackIconId=generateIconId();
        slice.oIcons[nBackIconId]={
          sIconName: "Back",
          sIconImagePath: "icon_back.bmp",
          nLinkedPageId: 0,
          sIconProgramPath: "",
          bIconIsBack: true,
        };
        slice.oIconPages[nNewPageId].aIcons[0]=nBackIconId;
        slice.oIconPages

      }
      function generatePageId(){
        let nNewId:number;
        do{
          nNewId=slice.nIdPageGenerator++;
        }while(slice.oIconPages[nNewId]);
        return nNewId;
      }
    },
    removeIcon(slice,action: PayloadAction<number>){
      const nIconPosition=action.payload;
      const nActiveConfigPageId=slice.nActiveConfigPageId;
      const oActivePage=slice.oIconPages[nActiveConfigPageId];
      const nIconId=oActivePage.aIcons[nIconPosition];
      /* check for related pages*/
      const oIcon = slice.oIcons[nIconId];
      const nLinkedPageId = oIcon.nLinkedPageId;

      if(nLinkedPageId!=0){
        slice.nPageChangeCounter++;
        removePage(nLinkedPageId);
        for(let i=0;i<oActivePage.aPages.length;i++){
          if(oActivePage.aPages[i]==nLinkedPageId){
            slice.oIconPages[nActiveConfigPageId].aPages.splice(i,1);
          }
        }
      }
      removeIcon(nIconId)


      slice.oIconPages[nActiveConfigPageId].aIcons[nIconPosition]=0;

      function removePage(nPageId:number){
        console.log("delete page "+nPageId)
        const page= slice.oIconPages[nPageId];
        /* remove all pages linked to this page */
        page.aPages.forEach((nPageId:number)=>{
          removePage(nPageId);
        });
        /* remove all icons linked to this page */
        page.aIcons.forEach((nIconIdR:number)=>{
          if(nIconIdR!=0){
            removeIcon(nIconIdR);
          }
        });
        if(slice.nActivePageId==nPageId){
          slice.nActivePageId=0;
        }
        delete slice.oIconPages[nPageId];
      }
      function removeIcon(nIconIdRem:number){
        console.log("delete icon "+nIconIdRem)
        delete slice.oIcons[nIconIdRem];
      }

    },
    iconPress(state,action: PayloadAction<number[]>){
      const nIconPosition=action.payload;
      let nButtonPressed=-1;
      for(let i=0;i<nIconPosition.length;i++){
        if(nIconPosition[i]!==0){
          nButtonPressed=i;
          console.log(' button press ' +nButtonPressed)
        }
      }
      const nActivePageId=state.nActivePageId;
      const oActivePage=state.oIconPages[nActivePageId];
      if(nButtonPressed!=-1){
        let nIconPressed = oActivePage.aIcons[nButtonPressed];
        console.log(nIconPressed)
        const oIconPressed=state.oIcons[nIconPressed];
        if(oIconPressed!==undefined){
          if(oIconPressed.bIconIsBack){
            /* go back to parent page */
            const nParentPageId=state.oIconPages[nActivePageId].nParentPageId;
            if(nParentPageId!==undefined){
              state.nActivePageId=nParentPageId;
              state.nPageChangeCounter++;
            }
          }
          else if(oIconPressed.nLinkedPageId!=0){
            /* go to linked page */
            state.nActivePageId=oIconPressed.nLinkedPageId;
            state.nPageChangeCounter++;
          }else{
            // /* launch program */

          }
        }
      }
      console.log(' button press ' +nIconPosition)
    }
  }
});

/*export dispatch functions */
export const {setActiveIcons, setAllIcons, setIcon, setActivePageId, setActiveConfigPageId, addIcon, removeIcon, iconPress} = iconStateSlice.actions;
/* export reducer */
export default iconStateSlice.reducer;