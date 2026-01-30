// FIYAZ AHMED
const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ORDERS_REQUEST':
      return { ...state, loading: true, error: null };
    case 'GET_ORDERS_SUCCESS':
      return { ...state, loading: false, orders: action.payload };
    case 'GET_ORDERS_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default orderReducer;
