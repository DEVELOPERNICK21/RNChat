/* eslint-disable prettier/prettier */
import { combineReducers } from 'redux';
import users from './users';





const rootReducer = combineReducers({
    userDetails: users,

});
export default rootReducer;
