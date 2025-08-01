"use client";

import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { VoiceRecorder } from "@/features/chat/ui/VoiceRecorder";

type InputFormProps = {
    onSend: (text: string) => void;
    isLoading?: boolean;
};

export function InputForm({ onSend, isLoading = false }: InputFormProps) {
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSend(input);
            setInput("");
        }
    };

    const handleTranscription = (text: string) => {
        setInput(prev => (prev ? `${prev} ${text}` : text));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-xl mb-[20px] mx-auto">
            <div className="flex items-center border-2 pl-3 border-[#143F83] rounded-lg">
                <VoiceRecorder
                    onTranscription={handleTranscription}
                />
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full text-white p-3  outline-none focus:outline-none "
                    placeholder="Type a message..."
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className={`p-3 rounded-md ${!input.trim() || isLoading ? 'bg-[#416196]' : 'bg-[#1D4D9B] hover:bg-[#143F83] cursor-pointer'}`}
                    aria-label="Send message"
                >
                    <PaperAirplaneIcon width="24px" height="24px" color="white" />
                </button>
            </div>
        </form>
    );
}