import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChallengeVariable {
  flag: boolean;
  model: object;
}

const initialState: ChallengeVariable = {
  flag: false,
  model: {},
};

const challengeSlice = createSlice({
  name: "challenge",
  initialState,
  reducers: {
    setModalFlag: (
      state,
      action: PayloadAction<{ flag: boolean; model: object }>
    ) => {
      state.flag = action.payload.flag;
      state.model = action.payload.model;
    },
  },
});

export const challengeReducer = challengeSlice.reducer;
export const challengeActions = challengeSlice.actions;
