import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const ChatContext = createContext<ChatContextType>({
    socket: null,
    isConnected: false,
});

export const useChat = () => {
    return useContext(ChatContext);
};

interface ChatProviderProps {
    children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const _handleClientEvent = (event: string) => {
    }

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
            autoConnect: true,
            withCredentials: true,
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        setSocket(newSocket);

        // Cleanup on unmount
        return () => {
            newSocket.close();
        };
    }, []);



    const value = {
        socket,
        isConnected,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}; 