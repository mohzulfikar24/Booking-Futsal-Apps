import ACTION_STRING from "./actionStrings";
// import { Logout, changeIdentity, getProfile, loginAuth, patchProfile } from "../../utils/Axios";
import { Logout, changeIdentity, API, loginAuth, patchProfile } from "../../utils/Axios";

// Action Login
const loginPending = () => ({
    type: ACTION_STRING.login.concat(ACTION_STRING.pending),
  });
  
  const loginRejected = (error) => ({
    type: ACTION_STRING.login.concat(ACTION_STRING.rejected),
    payload: error,
  });
  
  const loginFulfilled = (payload) => ({
    type: ACTION_STRING.login.concat(ACTION_STRING.fulfilled),
    payload: payload,
  });

  

  const loginThunk = (body) => {
    return async (dispatch) => {
      try {
        await dispatch(loginPending());
        const result = await loginAuth(body);
        await dispatch(loginFulfilled(result.data.data.token));
        await dispatch(userIDThunk(result.data.data.token))
      } catch (error) {
        console.log(error.response.data.msg);
        dispatch(loginRejected(error.response.data.msg));
        throw error.response.data.msg
      }
    };
  };


  // Action Get user by id
const profilePending = () => ({
  type: ACTION_STRING.profile.concat(ACTION_STRING.pending),
});

const profileRejected = (error) => ({
  type: ACTION_STRING.profile.concat(ACTION_STRING.rejected),
  payload: { error },
});

const profileFulfilled = (data) => ({
  type: ACTION_STRING.profile.concat(ACTION_STRING.fulfilled),
  payload: data ,
});

const userIDThunk = (token) => {
  return async (dispatch) => {
    try {
      await dispatch(profilePending());
      console.log(token);
      const result = await API.getProfile(token);
      console.log("resultProfile", result)
      dispatch(profileFulfilled(result.data.data[0]));
    } catch (error) {
      // console.log("errorUSERID", error.response.data);
      dispatch(profileRejected(error));
      throw error
    }
  };
};

const editProfile = (token, body) => {
  return async (dispatch) => {
    try {
      await dispatch(profilePending());
      console.log(token);
      const result = await patchProfile(token, body);
      dispatch(profileFulfilled(result.data.data[0]));
    } catch (error) {
      // console.log("errorUSERID", error.response.data);
      dispatch(profileRejected(error));
      throw error
    }
  };
};

const ktpPending = () => ({
    type: ACTION_STRING.ktp.concat(ACTION_STRING.pending),
  });
  
  const ktpRejected = (error) => ({
    type: ACTION_STRING.ktp.concat(ACTION_STRING.rejected),
    payload: error,
  });
  
  const ktpFulfilled = (payload) => ({
    type: ACTION_STRING.ktp.concat(ACTION_STRING.fulfilled),
    payload: payload,
  });

const changeKTP = (token, body) => {
  return async (dispatch) => {
    try {
      await dispatch(ktpPending());
      console.log(token);
      const result = await changeIdentity(token, body);
      console.log("resulttt", result)
      dispatch(ktpFulfilled(result.data.filename));
    } catch (error) {
      // console.log("errorUSERID", error.response.data);
      dispatch(ktpRejected(error));
      throw error
    }
  };
};

const reset = (data) => ({
  type: ACTION_STRING.reset,
});

const resetReducer = () => {
  return (dispatch) => {
    dispatch(reset());
  };
};

  const authAction = {
      loginThunk,
      userIDThunk,
      resetReducer,
      editProfile,
      changeKTP,
      // logoutThunk,
  };
  
  export default authAction;