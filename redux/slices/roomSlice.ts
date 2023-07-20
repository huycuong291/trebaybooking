import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { HotelsRooms, RoomProps } from '@/utils/types';

export const roomSlice = createSlice({
  name: 'room',
  initialState: { hotelRooms: [] as RoomProps[], selectedRooms: [] as RoomProps[] },
  reducers: {
    setAllRooms: (state, action: PayloadAction<RoomProps[]>) => {
      state.hotelRooms = action.payload;
    },
    setRoom: (state, action: PayloadAction<RoomProps>) => {
      state.selectedRooms.push(action.payload);
    },
    unSetRoom: (state, action) => {
      const index = state.selectedRooms.indexOf(action.payload);
      state.selectedRooms.splice(index, 1);
    },
    unSetAllRooms: (state) => {
      state.selectedRooms = [];
    }
  },
  extraReducers: (builder) => {
    builder.addDefaultCase((state) => state);
  }
});
