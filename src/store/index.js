import { configureStore } from "@reduxjs/toolkit";
import app from "~/store/app";

const store = configureStore({
  reducer: {
    app,
  },
  devTools: false,
});

export default store;
