import {combineReducers} from '@reduxjs/toolkit';
import authReducer from './auth';


// untuk menyabungkan jika ada reducer banyak
export default combineReducers({
  auth: authReducer,
});