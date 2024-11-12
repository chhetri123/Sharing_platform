import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    let newSocket = null;

    if (isAuthenticated) {
      // Create socket connection
      newSocket = io("http://localhost:3001", {
        auth: {
          token: localStorage.getItem("token"),
        },
      });

      // Set up event listeners
      newSocket.on("connect", () => {
        console.log("Socket connected");
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      setSocket(newSocket);
    }

    // Cleanup function
    return () => {
      if (newSocket) {
        newSocket.close();
        setSocket(null);
      }
    };
  }, [isAuthenticated]);

  const value = {
    socket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
