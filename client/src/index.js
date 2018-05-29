import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';
import { BrowserRouter } from 'react-router-dom';

import App from './components/app'
import reducers from './root_reducer';
import AuthMiddleware from './middlewares/authentication'
import logoutMiddleware from './middlewares/logout'

const createStoreWithMiddleware = applyMiddleware(AuthMiddleware,logoutMiddleware,ReduxPromise)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
      <App />  
    </BrowserRouter>
  </Provider>
  , document.querySelector('#container'));