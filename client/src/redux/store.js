// import {configureStore} from "@reduxjs/toolkit";

// import {
//     useDispatch as useAppDispatch,
//     useSelector as useAppSelector
// } from "react-redux";
// import { rootReducer } from "./rootReducer";


// const store = configureStore({
//     reducer: rootReducer
// })

// const {dispatch} = store;
// const useSelector = useAppSelector;
// const useDispatch = ()=> useAppDispatch();

// export {store , dispatch , useDispatch , useSelector};

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // Import the user slice

// Create and configure the Redux store
const store = configureStore({
    reducer: {
        user: userReducer, // Add your user slice reducer
    },
});

export default store; // Export the store
