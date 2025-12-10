import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../components/refreshToken/axios";


export const getAllContacts = createAsyncThunk(
    'message/getAllContacts',
    async (_, {rejectWithValue})=>{
        try {
            const res = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/message/contacts`)
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const getChatPartners = createAsyncThunk(
    'message/getChatPartners',
    async(_, {rejectWithValue})=>{
        try {
            const res = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/message/chats`)
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const getMessagesByUserId = createAsyncThunk(
    'message/getMessagesByUserId',
    async(id, {rejectWithValue})=>{
        try {
            const res = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/message/${id}`)
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const sendMessage = createAsyncThunk(
    'message/sendMessage',
    async({id,message}, {rejectWithValue})=>{
        try {
            const res = await axiosInstance.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/message/send/${id}`,
                message
            )
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)


const initialState = {
  allContacts: [],
  chats: [],
  loading: false,
  error: null,
  messages: [],
  chatPartners: [],
  activeTab: "chats",
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: localStorage.getItem("isSoundEnabled") ? localStorage.getItem("isSoundEnabled")=== 'true' : 'true',
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    toggleSound: (state) => {
      state.isSoundEnabled = !state.isSoundEnabled;
      localStorage.setItem("isSoundEnabled", state.isSoundEnabled);
    },

    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },

    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder)=>{
    //get all contacts
    builder
        .addCase(getAllContacts.pending, (state)=>{
            state.error = null,
            state.loading = true
        })
        .addCase(getAllContacts.fulfilled, (state, action)=>{
            state.loading = false,
            state.allContacts = action.payload
        })
        .addCase(getAllContacts.rejected, (state, action)=>{
            state.loading = false,
            state.error = action.payload
        })

    //get chat partners
    builder
        .addCase(getChatPartners.pending, (state)=>{
            state.loading = true,
            state.error = null
        })
        .addCase(getChatPartners.fulfilled, (state, action)=>{
            state.loading = false,
            state.chatPartners = action.payload
        })
        .addCase(getChatPartners.rejected, (state, action)=>{
            state.loading = false
            state.error = action.payload
        })
    
    //get messages by user id
    builder
        .addCase(getMessagesByUserId.pending, (state)=>{
            state.loading = true,
            state.error = null
        })
        .addCase(getMessagesByUserId.fulfilled, (state, action)=>{
            state.loading = false
            state.messages = action.payload
        })
        .addCase(getMessagesByUserId.rejected, (state, action)=>{
            state.loading = false
            state.error = action.payload
        })

    //send message
    builder
        .addCase(sendMessage.pending, (state)=>{
            state.loading = true
            state.error = null
        })
        .addCase(sendMessage.fulfilled, (state, action)=>{
            state.loading = false
            state.messages = action.payload
        })
        .addCase(sendMessage.rejected, (state, action)=>{
            state.loading = false
            state.error = action.payload
        })
  }
});

export const { toggleSound, setActiveTab, setSelectedUser } =
  messageSlice.actions;

export default messageSlice.reducer;
