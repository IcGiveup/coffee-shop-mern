// FIYAZ AHMED
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { cartReducer } from './reducers/cartReducer';
import { loginUserReducer, registerUserReducer } from './reducers/userReducer';
import coffeeReducer from './reducers/coffeeReducer'; // ✅ ADD THIS

const reducer = combineReducers({
  cart: cartReducer,
  loginUser: loginUserReducer,
  registerUser: registerUserReducer,
  coffee: coffeeReducer, // ✅ ADD THIS
});

const middleware = [thunk];

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;