import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch last 50 messages for an order
export const fetchMessages = createAsyncThunk(
    "chat/fetchMessages",
    async ({ orderId }, { rejectWithValue }) => {  // <- destructure here
        try {
            const response = await axios.get(`/api/chat?orderId=${orderId}`);
            return response.data.data || [];
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch messages");
        }
    }
);



// Send a new message
export const sendMessage = createAsyncThunk(
    "chat/sendMessage",
    async ({ orderId, sender, senderRole, receiverId, receiverRole, text }, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/chat", {
                orderId,
                sender,
                senderRole,
                receiverId,
                receiverRole,
                text
            });
            return response.data; // backend se naya message
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to send message");
        }
    }
);


const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: [],
        loading: false,
        error: null,
    },
    reducers: {
        // optional: clear messages
        clearMessages: (state) => {
            state.messages = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch messages
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });

        // Send message
        builder
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.messages.push(action.payload); // push new message to end
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
