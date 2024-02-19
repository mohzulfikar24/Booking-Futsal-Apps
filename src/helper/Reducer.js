import React, { useReducer, createContext } from "react";


const initialState = {
    test:''
};

const reducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case 'SET':
            return {...state, ...payload};
        case 'CLEAR':
            return initialState
        default:
            return state;
    }
};


const store = createContext(initialState);

const { Provider } = store;

const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    // console.log("isiState", state);
    // console.log("isidispact", dispatch);
    return <Provider value={{ state, dispatch }}>{children}</Provider>;
  };
  
  export { store, StateProvider };