// FIYAZ AHMED
export const getOrdersByUserId = (userId) => async (dispatch) => {
  try {
    dispatch({ type: 'GET_ORDERS_REQUEST' });

    const response = await fetch(`/api/orders/user/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    const orders = await response.json();
    dispatch({ type: 'GET_ORDERS_SUCCESS', payload: orders });
  } catch (error) {
    dispatch({ type: 'GET_ORDERS_FAIL', payload: error.message });
  }
};