"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MicrophoneIcon } from "@heroicons/react/24/solid";

type SpeechRecognitionEvent = {
    results: SpeechRecognitionResultList;
    resultIndex: number;
};

type SpeechRecognitionType = {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: Event) => void;
    onend: () => void;
};

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognitionType;
        webkitSpeechRecognition: new () => SpeechRecognitionType;
    }
}

export const VoiceRecorder = ({ onTranscription }: { onTranscription: (text: string) => void }) => {
    const [isListening, setIsListening] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const recognitionRef = useRef<SpeechRecognitionType | null>(null);
    const animationRef = useRef<number | null>(null);

    const stopAnimation = useCallback(() => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        setIsAnimating(false);
    }, []);

    const startAnimation = useCallback(() => {
        setIsAnimating(true);
        const animate = () => {
            if (isListening) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                stopAnimation();
            }
        };
        animationRef.current = requestAnimationFrame(animate);
    }, [isListening, stopAnimation]);

    const initRecognition = useCallback(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                console.error("Web Speech API не поддерживается");
                return null;
            }

            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-EN";

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        transcript += event.results[i][0].transcript;
                    }
                }
                if (transcript) onTranscription(transcript);
            };

            recognition.onerror = () => {
                console.error("Ошибка распознавания");
                setIsListening(false);
                stopAnimation();
            };

            recognition.onend = () => {
                if (isListening) {
                    const newRecognition = initRecognition();
                    if (newRecognition) {
                        recognitionRef.current = newRecognition;
                        newRecognition.start();
                    }
                }
            };

            return recognition;
        }
        return null;
    }, [isListening, onTranscription, stopAnimation]);

    const toggleListening = useCallback(() => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            stopAnimation();
        } else {
            const newRecognition = initRecognition();
            if (newRecognition) {
                recognitionRef.current = newRecognition;
                newRecognition.start();
                setIsListening(true);
                startAnimation();
            }
        }
    }, [isListening, initRecognition, startAnimation, stopAnimation]);

    useEffect(() => {
        return () => {
            stopAnimation();
            recognitionRef.current?.stop();
        };
    }, [stopAnimation]);

    return (
        <button
            type="button"
            onClick={toggleListening}
            className="focus:outline-none relative"
            aria-label={isListening ? "Остановить запись" : "Начать запись"}
        >
            <div className={`relative ${isAnimating ? "animate-pulse" : ""}`}>
                <MicrophoneIcon
                    width="24px"
                    height="24px"
                    color={isListening ? "#FF0000" : "#2456A8"}
                    className="cursor-pointer transition-all duration-300"
                />
                {isListening && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute w-8 h-8 bg-red-500 rounded-full opacity-0 animate-ping" />
                    </div>
                )}
            </div>
        </button>
    );
};