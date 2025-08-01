"use client";
import { motion } from "framer-motion";
import { MessageType } from "@/entities/message/types";

type MessageProps = {
    messageData: MessageType;
};

const formatTimestamp = (timestamp: string) => {
    try {
        const date = new Date(timestamp);
        return isNaN(date.getTime())
            ? ''
            : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
        return '';
    }
};

export const Message = ({ messageData }: MessageProps) => {
    if (messageData.isLoading) {
        return (
            <div className={`flex ${messageData.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[600px]">
                    <div className="w-fit bg-[#143872] rounded-md px-4 py-3">
                        <div className="flex space-x-2">
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 bg-[#B5C9E3] rounded-full"
                                    animate={{
                                        y: [0, -3, 0],
                                        opacity: [0.6, 1, 0.6]
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        delay: i * 0.2
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className={`flex flex-col ${messageData.from}`}
            initial={{ opacity: 0, y: messageData.from === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className={`max-w-[600px] ${messageData.from === "user" ? "self-end" : ""}`}>
                <div className={`w-fit text-[#B5C9E3] py-2 px-4 rounded-md ${
                    messageData.from === "user" ? "bg-[#1D4D9B]" : "bg-[#143872]"
                }`}>
                    {messageData.message}
                </div>
                <div className={`mx-1 text-white opacity-75 ${
                    messageData.from === "user" ? "text-end" : ""
                }`}>
                    {formatTimestamp(messageData.timestamp)}
                </div>
            </div>
        </motion.div>
    );
};