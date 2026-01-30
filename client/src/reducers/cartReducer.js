// FIYAZ AHMED
const initialState = {
  cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const newItem = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item._id === newItem._id && item.variant === newItem.variant
      );

      let updatedCartItems;
      if (existingItemIndex >= 0) {
        updatedCartItems = [...state.cartItems];
        updatedCartItems[existingItemIndex] = newItem;
      } else {
        updatedCartItems = [...state.cartItems, newItem];
      }

      return { ...state, cartItems: updatedCartItems };
    }
    case 'REMOVE_FROM_CART': {
      const itemToRemove = action.payload;
      const updatedCartItems = state.cartItems.filter(
        (item) =>
          !(item._id === itemToRemove._id && item.variant === itemToRemove.variant)
      );
      return { ...state, cartItems: updatedCartItems };
    }
    case 'CLEAR_CART': {
      return { ...state, cartItems: [] };
    }
    default:
      return state;
  }
};