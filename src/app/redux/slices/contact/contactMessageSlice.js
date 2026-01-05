import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Send new contact message
export const sendContactMessage = createAsyncThunk(
    "contactMessage/sendContactMessage",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await axios.post("/api/contactMessage", payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to send message");
        }
    }
);

// Fetch all messages
export const fetchContactMessages = createAsyncThunk(
    "contactMessage/fetchContactMessages",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get("/api/contactMessage");
            return res.data.messages;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch messages");
        }
    }
);

// Post admin reply
export const postReplyMessage = createAsyncThunk(
    "contactMessage/postReplyMessage",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await axios.post("/api/contactMessage/reply", payload);
            return res.data.reply;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to send reply");
        }
    }
);

// Delete message
export const deleteContactMessage = createAsyncThunk(
    "contactMessage/deleteContactMessage",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.delete("/api/contactMessage", { data: { id } });
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete message");
        }
    }
);

// Read message
export const readContactMessage = createAsyncThunk(
    "contactMessage/readContactMessage",
    async ({ id, role }, { rejectWithValue }) => {
        try {
            const res = await axios.put("/api/contactMessage/read", {
                id,
                role,
            });
            return res.data.message;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to mark as read");
        }
    }
);


const contactMessageSlice = createSlice({
    name: "contactMessage",
    initialState: {
        messages: [],
        loading: false,
        error: null,
        success: null,
    },
    reducers: {
        resetContactState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Send
            .addCase(sendContactMessage.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(sendContactMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.message;
                state.messages.unshift(action.payload.contactMessage);
            })
            .addCase(sendContactMessage.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })

            // Fetch
            .addCase(fetchContactMessages.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchContactMessages.fulfilled, (state, action) => { state.loading = false; state.messages = action.payload; })
            .addCase(fetchContactMessages.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })

            // Post Reply
            .addCase(postReplyMessage.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(postReplyMessage.fulfilled, (state, action) => {
                state.loading = false;
                const reply = action.payload;
                const msgIndex = state.messages.findIndex(m => m.id === reply.contactMessageId);
                if (msgIndex !== -1) {
                    state.messages[msgIndex].replies.push(reply);
                }
            })
            .addCase(postReplyMessage.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })

            // Delete
            .addCase(deleteContactMessage.fulfilled, (state, action) => {
                state.messages = state.messages.filter(msg => msg.id !== action.payload);
            })

            // Read message
            .addCase(readContactMessage.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.messages.findIndex(m => m.id === updated.id);

                if (index !== -1) {
                    state.messages[index] = {
                        ...state.messages[index],
                        readByAdmin: updated.readByAdmin,
                        readByUser: updated.readByUser,
                    };
                }
            });
    },
});

export const { resetContactState } = contactMessageSlice.actions;
export default contactMessageSlice.reducer;
