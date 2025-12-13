import { getSocket } from "./socketSlice"
import { setOnlineUsers } from "./socketSlice"

/**
 * Initialize all socket event listeners
 * Call this once after socket connection
 */
export const initSocketListeners = (dispatch) => {
  const socket = getSocket()
  if (!socket) return

  /* =======================
     CONNECTION EVENTS
  ======================= */

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id)
  })

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason)
  })

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message)
  })

  /* =======================
     USER STATUS EVENTS
  ======================= */

  socket.on("getOnlineUsers", (onlineUsers) => {
    // onlineUsers = [userId1, userId2, ...]
    dispatch(setOnlineUsers(onlineUsers))
  })

  /* =======================
     CLEANUP (optional)
  ======================= */

  socket.on("error", (error) => {
    console.error("Socket error:", error)
  })
}
