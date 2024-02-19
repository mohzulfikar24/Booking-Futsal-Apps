import {ActionType} from 'redux-promise-middleware';

const ACTION_STRING = {
    pending: `_${ActionType.Pending}`,
    fulfilled: `_${ActionType.Fulfilled}`,
    rejected: `_${ActionType.Rejected}`,
    login: 'AUTH_LOGIN',
    logout: 'AUTH_LOGOUT',
    profile: 'PROFILE',
    reset: 'RESET_AUTH',
    ktp: 'KTP'
  };
  
  export default ACTION_STRING;