import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WithdrawVariable {
    flag: boolean;
    model: object;
}

const initialState: WithdrawVariable = {
    flag: false,
    model: {}
}

const withdrawSlice = createSlice({
    name: 'withdraw',
    initialState,
    reducers: {
        setModalFlag: (state, action: PayloadAction<{ flag: boolean, model: object }>) => {
            state.flag = action.payload.flag;
            state.model = action.payload.model;
        }
    }
});

export const withdrawReducer = withdrawSlice.reducer;
export const withdrawActions = withdrawSlice.actions;