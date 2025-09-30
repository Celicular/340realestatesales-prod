// src/redux/slices/villaSlice.js
import { createSlice } from "@reduxjs/toolkit";
import villas from "../../data/Villas";

const initialState = {
  villas: villas,
  selectedVilla: null,
  bookingDetails: {
    checkIn: null,
    checkOut: null,
    guests: 1,
    message: "",
  },
};

const villaSlice = createSlice({
  name: "villa",
  initialState,
  reducers: {
    selectVilla: (state, action) => {
      const villa = state.villas.find((v) => v.name === action.payload);
      if (!villa) {
        console.warn(`Villa not found: "${action.payload}". Available villas:`, state.villas.map(v => v.name));
      }
      state.selectedVilla = villa || null;
    },
    setBookingDates: (state, action) => {
      state.bookingDetails.checkIn = action.payload.checkIn;
      state.bookingDetails.checkOut = action.payload.checkOut;
    },
    setGuests: (state, action) => {
      state.bookingDetails.guests = action.payload;
    },
    setMessage: (state, action) => {
      state.bookingDetails.message = action.payload;
    },
    resetBooking: (state) => {
      state.bookingDetails = {
        checkIn: null,
        checkOut: null,
        guests: 1,
        message: "",
      };
    },
  },
});

export const {
  selectVilla,
  setBookingDates,
  setGuests,
  setMessage,
  resetBooking,
} = villaSlice.actions;

export default villaSlice.reducer;
