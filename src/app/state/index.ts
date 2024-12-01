import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from '@/firebase/firebaseconfig'; 
import { doc, setDoc, getDoc } from "firebase/firestore";

export interface InitialStateTypes {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
}

// Define the initial state
const initialState: InitialStateTypes = {
  isSidebarCollapsed: false,
  isDarkMode: false,
};


export const loadSettings = createAsyncThunk('global/loadSettings', async () => {
  const settingsDoc = doc(db, "settings", "userPreferences"); 
  const docSnap = await getDoc(settingsDoc);
  
  if (docSnap.exists()) {
    return docSnap.data() as InitialStateTypes;
  } else {
    
    return initialState;
  }
});

export const saveSettings = createAsyncThunk('global/saveSettings', async (settings: InitialStateTypes) => {
  const settingsDoc = doc(db, "settings", "userPreferences"); 
  await setDoc(settingsDoc, settings);
  return settings;
});

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSettings.fulfilled, (state, action) => {
        return { ...state, ...action.payload }; 
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        return { ...state, ...action.payload }; 
      });
  },
});

export const { setIsSidebarCollapsed, setIsDarkMode } = globalSlice.actions;
export default globalSlice.reducer;



