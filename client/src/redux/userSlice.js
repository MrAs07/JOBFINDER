// import { createSlice } from "@reduxjs/toolkit";
// import { users } from "../utils/data";


// const initialState = {

//     user: JSON.parse(window?.localStorage.getItem("userInfo")) ?? {},
// }

// const userSlice = createSlice({
//     name: 'userInfo',
//     initialState,
//     reducers: {
//         login(state, action) {
//             state.user = action.payload.user;
//         },
//         logout(state) {
//             state.user = null;
//             // remove from local storage
//             localStorage?.removeItem("userInfo")
//         }
//     }
// });
// export default userSlice.reducer;

// export function Login(user) {
//     return (dispatch, getState) => {
//         dispatch(userSlice.actions.login({user}));
//     }
// }

// export function Logout() {
//     return (dispatch, getState) => {
//         dispatch(userSlice.actions.logout());
//     }
// }


// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     user: JSON.parse(window?.localStorage.getItem("userInfo")) || {},
// };

// const userSlice = createSlice({
//     name: 'userInfo',
//     initialState,
//     reducers: {
//         login(state, action) {
//             const user = action.payload.user;
//              localStorage.setItem("userInfo", JSON.stringify(user)); // Update localStorage
//             return {
//                 ...state,
//                 user, // Ensure immutability
//             };
//         },
//         logout(state) {
//             localStorage?.removeItem("userInfo");
//             return {
//                 ...state,
//                 user: {}, // Reset user state
//             };
//         }
//     }
// });

// // Exporting the reducer
// export default userSlice.reducer;

// // Action creators
// export const { login, logout } = userSlice.actions;

// // Thunk to handle login
// export function Login(user) {
//     return (dispatch) => {
//         dispatch(login({ user }));
//     };
// }

// // Thunk to handle logout
// export function Logout() {
//     return (dispatch) => {
//         dispatch(logout());
//     };
// }

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     user: JSON.parse(window.localStorage.getItem("userInfo")) || {}, // Initialize properly
// };

// const userSlice = createSlice({
//     name: 'userInfo',
//     initialState,
//     reducers: {
//         login(state, action) {
//             const user = action.payload.user;
//             localStorage.setItem("userInfo", JSON.stringify(user));
//             console.log("Logging in user:", user);  // Add this to see the user payload
//             return { ...state, user };  // Always return new state
//         },
//         logout(state) {
//             console.log("logout is running")
//             localStorage.removeItem("userInfo");
//             return { ...state, user: {} };
//         }
//     }
// });

// export const { login, logout } = userSlice.actions;

// export default userSlice.reducer;

// // Thunk for login
// export function Login(user) {
//     return (dispatch) => {
//         dispatch(login({ user }));
//     };
// }

// // Thunk for logout
// export function Logout() {
//     return (dispatch) => {
//         dispatch(logout());
//     };
// }

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: JSON.parse(window.localStorage.getItem("userInfo")) || {}, // Initialize properly
};

const userSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        login(state, action) {
            const user = action.payload;
            localStorage.setItem("userInfo", JSON.stringify(user));  // Store user in local storage
            return { ...state, user };  // Return new state with user
        },
        logout(state) {
            localStorage.removeItem("userInfo");
            return { ...state, user: {} };
        }
    }
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;

// Thunk for login
export function Login(user) {
    return (dispatch) => {
        dispatch(login(user)); // Passing user object directly
    };
}

// Thunk for logout
export function Logout() {
    return (dispatch) => {
        dispatch(logout());
    };
}
