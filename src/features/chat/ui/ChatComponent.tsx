"use client"
import { InputForm, WelcomeScreen } from "@/features/chat";
import { Container } from "@/shared";
import { useChatStore } from "@/features/chat/model/chatStore";
import { MessageList } from "@/features/chat/ui/MessageList";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

export const ChatComponent = () => {
    const { messages, sendUserMessage } = useChatStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSend = async (message: string) => {
        await sendUserMessage(message);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Container className="h-full flex flex-col max-w-2xl mx-auto">
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                <AnimatePresence>
                    {!messages.length ? (
                        <motion.div
                            key="welcome-screen"
                            className="h-full flex flex-col items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <WelcomeScreen />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="messages-list"
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <MessageList />
                            <div ref={messagesEndRef} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.div
                className="sticky bottom-0 bg-background pt-2 pb-4 px-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <InputForm onSend={handleSend} />
            </motion.div>
        </Container>
    )
}