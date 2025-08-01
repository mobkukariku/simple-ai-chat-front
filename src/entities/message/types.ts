export interface ResponseMessageType {
    id: string;
    text: string;
    timestamp: string; // Исправлено с timestap на timestamp
}

export interface MessageType {
    id: string;
    message: string;
    from: 'user' | 'gpt';
    timestamp: string;
    isLoading?: boolean;
}

export interface ApiResponse {
    success: boolean;
    data: {
        message: ResponseMessageType;
    };
    timestamp: string;
}