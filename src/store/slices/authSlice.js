import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const storeUser = localStorage.getItem('userInfo')
const userFromStorage = storeUser && storeUser !== 'undefined' ? JSON.parse(storeUser) : null

export const registration = createAsyncThunk(
    "auth/registration",
    async (userData, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/register`,
                userData
            )
            return res.data.message
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Registration failed" })
        }
    }
)

export const verifyEmail = createAsyncThunk(
    "auth/verifyEmail",
    async (reqValue, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/verify-register`,
                reqValue
            )
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "verify email failed" })
        }
    }
)

export const login = createAsyncThunk(
    "auth/login",
    async (userData, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/login`,
                userData,
                { withCredentials: true }
            )

            const user = res.data.user
            const token = res.data.accessToken

            localStorage.setItem('userInfo', JSON.stringify(user))
            localStorage.setItem('accessToken', token)

            return user
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'login failed' })
        }
    }
)

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/v1/logout`
            )
            localStorage.removeItem('userInfo')
            localStorage.removeItem('accessToken')
            
            return true
        } catch (error) {
            rejectWithValue(error.response?.data || { message: 'logout failed' })
        }
    }
)

const initialState = {
    user: userFromStorage,
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        //Registration
        builder
            .addCase(registration.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(registration.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(registration.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
        //Verify Email
        builder
            .addCase(verifyEmail.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(verifyEmail.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
        //Login
        builder
            .addCase(login.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
        //Logout
        builder
            .addCase(logout.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false
                state.user = null
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export default authSlice.reducer