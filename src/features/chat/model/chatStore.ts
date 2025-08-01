import { create } from "zustand";
import { MessageType, ApiResponse } from "@/entities/message/types";
import { sendMessage } from "@/features/chat/api/sendMessage";

interface ChatState {
    messages: MessageType[];
    status: 'idle' | 'loading' | 'error';
    error: string | null;
}

interface ChatActions {
    addMessage: (message: MessageType) => void;
    sendUserMessage: (text: string) => Promise<void>;
    clearError: () => void;
    validateTimestamp: (timestamp: string) => string | null;
}

const initialState: ChatState = {
    messages: [],
    status: 'idle',
    error: null,
};

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
    ...initialState,

    addMessage: (message) => {
        set((state) => ({ messages: [...state.messages, message] }));
    },

    sendUserMessage: async (text) => {
        const { addMessage, validateTimestamp } = get();
        const now = new Date();

        const userMessage: MessageType = {
            id: now.getTime().toString(),
            message: text,
            from: 'user',
            timestamp: now.toISOString()
        };

        addMessage(userMessage);

        const tempBotMessage: MessageType = {
            id: `temp-${now.getTime()}`,
            message: '',
            from: 'gpt',
            timestamp: now.toISOString(),
            isLoading: true
        };
        addMessage(tempBotMessage);

        try {
            set({ status: 'loading', error: null });

            const response = await sendMessage(text) as ApiResponse;

            if (response.success) {
                const serverTimestamp = response.data.message.timestamp;
                const validTimestamp = validateTimestamp(serverTimestamp) || new Date().toISOString();

                set(state => ({
                    messages: state.messages.map(msg =>
                        msg.id === tempBotMessage.id
                            ? {
                                id: response.data.message.id,
                                message: response.data.message.text,
                                from: 'gpt',
                                timestamp: validTimestamp,
                                isLoading: false
                            }
                            : msg
                    ),
                    status: 'idle'
                }));
            } else {
                throw new Error('Server returned unsuccessful response');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            set(state => ({
                messages: state.messages.filter(m => m.id !== tempBotMessage.id),
                status: 'error',
                error: error instanceof Error ? error.message : 'Failed to send message'
            }));
        }
    },

    clearError: () => {
        set({ error: null, status: 'idle' });
    },
    validateTimestamp: (timestamp: string): string | null => {
        try {
            const date = new Date(timestamp);
            return isNaN(date.getTime()) ? null : date.toISOString();
        } catch {
            return null;
        }
    }
}));