import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PoolChallengeVariable {
  model: object[];
}

const initialState: PoolChallengeVariable = {
  model: [],
};

const poolchallengeSlice = createSlice({
  name: "poolchallenge",
  initialState,
  reducers: {
    setModalData: (state: any, action: PayloadAction<{ model: object[] }>) => {
      state.model = action.payload;
    },
  },
});

export const poolchallengeReducer = poolchallengeSlice.reducer;
export const poolchallengeActions = poolchallengeSlice.actions;
