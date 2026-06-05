import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connection",
  initialState: null,
  reducers: {
    resetConnections: () => [],
    addConnections: (state, action) => action.payload,
    removeConnection: (state, action) => {
      if (!Array.isArray(state)) return state;
      return state.filter((conn) => conn._id !== action.payload);
    },
  },
});

export const { addConnections, removeConnection, resetConnections } = connectionSlice.actions;

export default connectionSlice.reducer;
