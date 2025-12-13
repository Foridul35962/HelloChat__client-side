import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import messageReducer from './slices/messageSlice'
import socketReducer from './slices/socketSlice'

const store = configureStore({
    reducer:{
        auth: authReducer,
        message: messageReducer,
        socket: socketReducer
    }
})

export default store