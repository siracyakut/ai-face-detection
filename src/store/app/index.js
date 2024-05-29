import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  image: null,
  error: false,
};

const app = createSlice({
  name: "app",
  initialState,
  reducers: {
    _setImage: (state, action) => {
      state.image = action.payload;
    },
    _setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { _setImage, _setError } = app.actions;
export default app.reducer;
