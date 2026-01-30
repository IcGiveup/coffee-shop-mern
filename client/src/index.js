// FIYAZ AHMED
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import App from './App';
import coffeeReducer from './reducers/coffeeReducer';
import { cartReducer } from './reducers/cartReducer';
import orderReducer from './reducers/orderReducer';
import { registerUserReducer, loginUserReducer } from './reducers/userReducer';
import './index.css';

const rootReducer = combineReducers({
  coffee: coffeeReducer,
  cart: cartReducer,
  order: orderReducer,
  loginUser: loginUserReducer,
  registerUser: registerUserReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);