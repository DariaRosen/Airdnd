import { configureStore } from "@reduxjs/toolkit"
import { homeReducer } from "./homes/homes.reducer"
import { userReducer } from "./user/user.reducer"
import { bookingReducer } from "./booking/booking.reducer"

export const store = configureStore({
  reducer: {
    homeModule: homeReducer,
    userModule: userReducer,
    bookingModule: bookingReducer,
  },
})

// For debugging in console
window.gStore = store
