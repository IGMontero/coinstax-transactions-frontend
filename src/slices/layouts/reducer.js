import { createSlice } from '@reduxjs/toolkit';
//constants
import {
  layoutModeTypes,
  layoutPositionTypes,
  layoutTypes,
  layoutWidthTypes,
  leftSidebarImageTypes,
  leftSidebarTypes,
  leftSidebarViewTypes,
  leftsidbarSizeTypes,
  preloaderTypes,
  sidebarVisibilitytypes,
  topbarThemeTypes,
} from '../../Components/constants/layout';
import {
  getCurrentThemeCookie,
  setCurrentThemeCookie,
} from '../../helpers/cookies_helper';

export const initialState = {
  layoutType: layoutTypes.VERTICAL,
  leftSidebarType: leftSidebarTypes.DARK,
  layoutModeType:
    getCurrentThemeCookie() === 'dark'
      ? layoutModeTypes.DARKMODE
      : layoutModeTypes.LIGHTMODE,

  layoutWidthType: layoutWidthTypes.FLUID,
  layoutPositionType: layoutPositionTypes.FIXED,
  topbarThemeType: topbarThemeTypes.DARK,
  leftsidbarSizeType: leftsidbarSizeTypes.COMPACT,
  leftSidebarViewType: leftSidebarViewTypes.DEFAULT,
  leftSidebarImageType: leftSidebarImageTypes.NONE,
  preloader: preloaderTypes.DISABLE,
  sidebarVisibilitytype: sidebarVisibilitytypes.SHOW,
};

// export const initialState = {
//   layoutType: layoutTypes.SEMIBOX,
//   leftSidebarType: leftSidebarTypes.DARK,
//   layoutModeType:
//     getCurrentThemeCookie() === 'dark'
//       ? layoutModeTypes.DARKMODE
//       : layoutModeTypes.LIGHTMODE,
//   layoutWidthType: layoutWidthTypes.FLUID,
//   layoutPositionType: layoutPositionTypes.FIXED,
//   topbarThemeType: topbarThemeTypes.LIGHT,
//   leftsidbarSizeType: leftsidbarSizeTypes.DEFAULT,
//   leftSidebarViewType: leftSidebarViewTypes.DETACHED,
//   leftSidebarImageType: leftSidebarImageTypes.NONE,
//   sidebarVisibilitytype: sidebarVisibilitytypes.SHOW,
// };

const LayoutSlice = createSlice({
  name: 'LayoutSlice',
  initialState,
  reducers: {
    changeLayoutAction(state, action) {
      state.layoutType = action.payload;
    },
    changeLayoutModeAction(state, action) {
      // setCurrentThemeCookie(
      //   action.payload === layoutModeTypes.DARKMODE ? 'dark' : 'light',
      // );

      state.layoutModeType = action.payload;
    },
    changeSidebarThemeAction(state, action) {
      state.leftSidebarType = action.payload;
    },
    changeLayoutWidthAction(state, action) {
      state.layoutWidthType = action.payload;
    },
    changeLayoutPositionAction(state, action) {
      state.layoutPositionType = action.payload;
    },
    changeTopbarThemeAction(state, action) {
      state.topbarThemeType = action.payload;
    },
    changeLeftsidebarSizeTypeAction(state, action) {
      state.leftsidbarSizeType = action.payload;
    },
    changeLeftsidebarViewTypeAction(state, action) {
      state.leftSidebarViewType = action.payload;
    },
    changeSidebarImageTypeAction(state, action) {
      state.leftSidebarImageType = action.payload;
    },
    changePreLoaderAction(state, action) {
      state.preloader = action.payload;
    },
    changeSidebarVisibilityAction(state, action) {
      state.sidebarVisibilitytype = action.payload;
    },
  },
});

export const {
  changeLayoutAction,
  changeLayoutModeAction,
  changeSidebarThemeAction,
  changeLayoutWidthAction,
  changeLayoutPositionAction,
  changeTopbarThemeAction,
  changeLeftsidebarSizeTypeAction,
  changeLeftsidebarViewTypeAction,
  changeSidebarImageTypeAction,
  changePreLoaderAction,
  changeSidebarVisibilityAction,
} = LayoutSlice.actions;

export default LayoutSlice.reducer;
