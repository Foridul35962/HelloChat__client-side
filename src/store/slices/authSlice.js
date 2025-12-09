import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import axiosInstance from '../../components/refreshToken/axios'

// Get token from localStorage (userInfo NOT stored)
const storeToken = localStorage.getItem('accessToken')

// ========================
// 1️⃣ AsyncThunk for registration
// ========================
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

// ========================
// 2️⃣ AsyncThunk for verify email
// ========================
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
      return rejectWithValue(error.response?.data || { message: "Verify email failed" })
    }
  }
)

// ========================
// 3️⃣ AsyncThunk for login
// ========================
export const login = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/login`,
        userData,
        { withCredentials: true }
      )

      const user = res.data.data.user
      const token = res.data.data.accessToken

      // Only store accessToken in localStorage
      localStorage.setItem('accessToken', token)

      return { user, accessToken: token }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Login failed' })
    }
  }
)

// ========================
// 4️⃣ AsyncThunk for logout
// ========================
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/logout`,
        {},
        { withCredentials: true }
      )

      localStorage.removeItem('accessToken')
      return true
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Logout failed' })
    }
  }
)

// ========================
// 5️⃣ AsyncThunk for fetching user info (/me API)
// ========================
export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const res = await axiosInstance.get(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/user`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return res.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Fetch user failed' })
    }
  }
)

export const refreshToken = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/refresh-token`,
        {},
        { withCredentials: true }
      )
      const token = res.data.data.accessToken
      localStorage.setItem('accessToken', token)
      return token
    } catch (err) {
      return rejectWithValue(err.response.data)
    }
  }
)


// ========================
// 6️⃣ Initial State
// ========================
const initialState = {
  user: null, // will be set by login or fetchMe
  accessToken: storeToken || null,
  loading: false,
  error: null,
  fetLoad: false
}

// ========================
// 7️⃣ Slice
// ========================
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // For interceptor after refresh token
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken
      state.user = action.payload.user
      localStorage.setItem('accessToken', action.payload.accessToken)
    },
    // Force logout (used manually)
    forceLogout: (state) => {
      state.user = null
      state.accessToken = null
      state.loading = false
      state.error = null
      localStorage.removeItem('accessToken')
    }
  },
  extraReducers: (builder) => {
    // ---- Registration ----
    builder
      .addCase(registration.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registration.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(registration.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // ---- Verify Email ----
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // ---- Login ----
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // ---- Logout ----
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.accessToken = null
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // ---- FetchMe ----
    builder
      .addCase(fetchMe.pending, (state) => {
        state.fetLoad = true
        state.error = null
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.fetLoad = false
        state.user = action.payload
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.fetLoad = false
        state.error = action.payload
        state.user = null
        state.accessToken = null
      })

    //refresh Token
    builder
      .addCase(refreshToken.pending, (state) => {
        state.loading = true
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false
        state.accessToken = action.payload
        state.authChecked = true
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.accessToken = null
        state.authChecked = true
      })

  }
})

export const { setCredentials, forceLogout } = authSlice.actions
export default authSlice.reducer