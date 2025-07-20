const initialState = {
  bookings: [],
  isLoading: false,
}

export function bookingReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_BOOKINGS":
      return { ...state, bookings: action.bookings }

    case "ADD_BOOKING":
      return { ...state, bookings: [...state.bookings, action.booking] }

    case "REMOVE_BOOKING":
      return {
        ...state,
        bookings: state.bookings.filter((b) => b._id !== action.bookingId),
      }

    case "UPDATE_BOOKING":
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b._id === action.booking._id ? action.booking : b
        ),
      }

    case "SET_IS_LOADING":
      return { ...state, isLoading: action.isLoading }

    default:
      return state
  }
}
