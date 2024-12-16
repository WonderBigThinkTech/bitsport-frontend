import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GenericState {
  currentUser: object;
  type: string;
}

const initialState: GenericState = {
  currentUser: {},
  type: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<object>) => {
      state.currentUser = action.payload;
      state.type = "";
    },
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
