import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import reducers from "./reducers/index";
import { encryptTransform } from 'redux-persist-transform-encrypt';

const persistConfig = {
  // key: "futsal",
  key: "futsal",
  storage,
  transforms: [
    encryptTransform({
      secretKey: 'futsal_key',
      onError: function (error) {
        // Handle the error.
        console.log("error", error)
      },
    }),
  ]

};

const persistedReducer = persistReducer(persistConfig, reducers);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }),
});

export const persistedStore = persistStore(store);
export default store;