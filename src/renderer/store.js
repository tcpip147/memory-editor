import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import testReducer from './reducer/testReducer';

const reducer = combineReducers({
    test: testReducer
});

const store = configureStore({
    reducer
});

export default store;