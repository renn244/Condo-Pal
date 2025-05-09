import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "./AuthContext";
import toast from "react-hot-toast";

type SocketContextType = {
    socket: Socket | undefined;
}

const initialState: SocketContextType = { socket: undefined }; 

const SocketContext = createContext<SocketContextType>(initialState);

export const useSocketContext = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({
    children
}: PropsWithChildren) => {
    const [socket, setSocket] = useState<Socket | undefined>(undefined);
    const { user } = useAuthContext();
    
    useEffect(() => {
        if(!user) return;

        const isProduction = import.meta.env.VITE_SOFTWARE_ENV === 'production';
        const socketUrl = isProduction ? '' : 'http://localhost:5000';

        const socket = io(socketUrl, {
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            transports: ['websocket'],
            query: { userId: user.id }
        })
        setSocket(socket);

        socket.on('connect', () => {
            console.log('Socket connected');
        })

        socket.on('disconnect', () => {
            toast.error('offline!')
        })

        return () => {
            socket.close();
        }
    }, [user])

    const value = {
        socket,
    }

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}