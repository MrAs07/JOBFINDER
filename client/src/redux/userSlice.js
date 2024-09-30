import { createSlice } from "@reduxjs/toolkit";
import { users } from "../utils/data";
import { dispatch } from "./store";

const initialState = {

    user: JSON.parse(window?.localStorage.getItem("userInfo")) ?? {},
}

const userSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        login(state, action) {
            state.user = action.payload.user;
        },
        logout(state) {
            state.user = null;
            // remove from local storage
            localStorage?.removeItem("userInfo")
        }
    }
});
export default userSlice.reducer;

export function Login(user) {
    return (dispatch, getState) => {
        dispatch(userSlice.actions.login(user));
    }
}

export function Logout() {
    return (dispatch, getState) => {
        dispatch(userSlice.actions.logout());
    }
}