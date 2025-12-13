import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { io } from "socket.io-client"
import notiSound from "../../assets/Audio/notification.mp3"
import { setMessages } from "./messageSlice"

let socket = null

// 🔹 connect socket
export const connectSocket = createAsyncThunk(
  "socket/connect",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        return rejectWithValue("No access token found")
      }

      socket = io(import.meta.env.VITE_SERVER_URL, {
        auth: {
          token
        },
        withCredentials: true
      })

      socket.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users))
      })

      return true
    } catch (error) {
      return rejectWithValue("Socket connection failed")
    }
  }
)

// 🔹 disconnect socket
export const disconnectSocket = createAsyncThunk(
  "socket/disconnect",
  async () => {
    if (socket) {
      socket.disconnect()
      socket = null
    }
    return true
  }
)

export const subscribeToMessages = () => (dispatch, getState) => {
  const socket = getSocket()
  const selectedUser = getState().message.selectedUser
  const isSoundEnabled = getState().message.isSoundEnabled

  if (!selectedUser || !socket) return

  socket.off("newMessage") // prevent duplicates
  socket.on("newMessage", (newMessage) => {
    const isFromSelectedUser = newMessage.senderId === selectedUser._id
    if (!isFromSelectedUser) return

    dispatch(setMessages([...getState().message.messages, newMessage]))

    if (isSoundEnabled) {
      const notificationSound = new Audio(notiSound)
      notificationSound.currentTime = 0
      notificationSound.play().catch((e) => console.log("Audio play failed:", e))
    }
  })
}

export const unsubscribeFromMessages = () => (dispatch, getState) => {
  const socket = getSocket()
  if (socket) socket.off("newMessage")
}


const socketSlice = createSlice({
  name: "socket",
  initialState: {
    connected: false,
    onlineUsers: [],
    error: null
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectSocket.fulfilled, (state) => {
        state.connected = true
        state.error = null
      })
      .addCase(connectSocket.rejected, (state, action) => {
        state.connected = false
        state.error = action.payload
      })
      .addCase(disconnectSocket.fulfilled, (state) => {
        state.connected = false
        state.onlineUsers = []
      })
  }
})

export const { setOnlineUsers } = socketSlice.actions
export default socketSlice.reducer

// 🔹 export socket instance
export const getSocket = () => socket
