import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";
import { useAuth } from "./GlobalProvider";
import { io, Socket } from "socket.io-client";
import { apiUrl } from "../constants";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: number[];
}

export const SocketContext = createContext<SocketContextType | any>(undefined);

interface SocketContextProviderProps {
  children: ReactNode;
}

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({
  children,
}: SocketContextProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const socketInstance = io(apiUrl, {
        query: {
          userId: user.id,
        },
      });

      setSocket(socketInstance);

      socketInstance.on("getOnlineUsers", (users: number[]) => {
        setOnlineUsers(users);
      });

      return () => {
        socketInstance.close();
      };
    } else if (!user && socket) {
      socket.close();
      setSocket(null);
    }

    return () => socket?.close();
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
