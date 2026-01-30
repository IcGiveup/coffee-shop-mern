// FIYAZ AHMED
import axios from 'axios';

export const getALLCoffee = () => async (dispatch) => {
  try {
    dispatch({ type: 'GET_COFFEE_REQUEST' });
    const { data } = await axios.get('/api/coffee');
    console.log('Coffee data from API:', data);
    dispatch({ type: 'GET_COFFEE_SUCCESS', payload: data });
  } catch (error) {
    dispatch({
      type: 'GET_COFFEE_FAIL',
      payload: error.message,
    });
    console.error('Error fetching coffee:', error.message);
  }
};