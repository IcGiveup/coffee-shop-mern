// FIYAZ AHMED
export const addToCart = (coffee, quantity, variant) => (dispatch, getState) => {
  try {
    if (!coffee || !coffee.variants || !coffee.prices) {
      console.error("❌ Invalid coffee data:", coffee);
      return;
    }

    const existingCartItem = getState()?.cart?.cartItems?.find(
      (item) => item._id === coffee._id && item.variant === variant
    );
    const stockCount =
      Number(coffee.stock) > 0
        ? Number(coffee.stock)
        : existingCartItem?.stock || 0;

    if (quantity > stockCount) {
      alert(`⚠️ Only ${stockCount} units available in stock.`);
      return;
    }

    const variantIndex = coffee.variants.indexOf(variant);
    const selectedVariantPrice =
      variantIndex >= 0 ? coffee.prices[variantIndex] || 0 : 0;

    const finalPricePerUnit =
      coffee.offer && coffee.offer > 0
        ? selectedVariantPrice -
          (selectedVariantPrice * Number(coffee.offer)) / 100
        : selectedVariantPrice;

    const totalPrice = finalPricePerUnit * quantity;

    const cartItem = {
      name: coffee.name,
      _id: coffee._id,
      image: coffee.image,
      variant,
      prices: coffee.prices,
      variants: coffee.variants,
      quantity,
      price: totalPrice,
      stock: stockCount,
      offer: coffee.offer || 0,
    };

    dispatch({
      type: "ADD_TO_CART",
      payload: cartItem,
    });

    const cartItems = getState()?.cart?.cartItems || [];
    const existingIndex = cartItems.findIndex(
      (item) => item._id === cartItem._id && item.variant === cartItem.variant
    );

    if (existingIndex >= 0) cartItems[existingIndex] = cartItem;
    else cartItems.push(cartItem);

    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    console.log("✅ Cart updated:", cartItem);
  } catch (error) {
    console.error("❌ Error in addToCart:", error);
  }
};

export const removeFromCart = (item) => (dispatch, getState) => {
  try {
    if (!item || !item._id || !item.variant) {
      console.error("❌ Invalid item data for removal:", item);
      return;
    }

    dispatch({
      type: "REMOVE_FROM_CART",
      payload: item,
    });

    const cartItems = getState()?.cart?.cartItems || [];
    const updatedCartItems = cartItems.filter(
      (cartItem) =>
        !(cartItem._id === item._id && cartItem.variant === item.variant)
    );

    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    console.log("🗑 Item removed successfully:", item);
  } catch (error) {
    console.error("❌ Error in removeFromCart:", error);
  }
};

export const clearCart = () => (dispatch) => {
  try {
    dispatch({
      type: "CLEAR_CART",
    });
    localStorage.removeItem("cartItems");
    console.log("🧹 Cart cleared successfully");
  } catch (error) {
    console.error("❌ Error in clearCart:", error);
  }
};
