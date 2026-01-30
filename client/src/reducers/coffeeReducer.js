// FIYAZ AHMED
const initialState = {
  loading: false,
  error: null,
  coffees: [],
};

const coffeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'COFFEE_FETCH_REQUEST':
      return { ...state, loading: true, error: null };
    case 'COFFEE_FETCH_SUCCESS':
      return { ...state, loading: false, coffees: action.payload };
    case 'COFFEE_FETCH_FAILED':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default coffeeReducer;

  