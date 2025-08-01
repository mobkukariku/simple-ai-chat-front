"use client";
import { useChatStore } from "@/features/chat/model/chatStore";
import { Message } from "@/features/chat/ui/Message";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

export const MessageList = () => {
    const { messages } = useChatStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <AnimatePresence>
            {messages.map((message, index) => (
                <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: message.from === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.3,
                        delay: index * 0.05
                    }}
                    exit={{ opacity: 0 }}
                    layout
                >
                    <Message messageData={message} />
                </motion.div>
            ))}

            <div ref={messagesEndRef} />
        </AnimatePresence>
    )
}