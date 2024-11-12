import { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";

const NotificationContext = createContext();

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (socket) {
      socket.on("new-notification", handleNewNotification);
      socket.on("family-request-response", handleFamilyRequestResponse);

      // Fetch existing notifications
      fetchNotifications();

      return () => {
        socket.off("new-notification");
        socket.off("family-request-response");
      };
    }
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleNewNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);

    // Show toast notification
    const message =
      notification.type === "FAMILY_REQUEST"
        ? `${notification.sender.name} sent you a family request`
        : `${notification.sender.name} joined your event ${notification.eventId.title}`;

    toast(message, {
      icon: notification.type === "FAMILY_REQUEST" ? "👨‍👩‍👧‍👦" : "🎉",
    });
  };

  const handleFamilyRequestResponse = ({ notification, accepted }) => {
    if (accepted) {
      toast.success(
        `${notification.recipient.name} accepted your family request!`
      );
    } else {
      toast.error(
        `${notification.recipient.name} declined your family request`
      );
    }

    // Update notifications list
    setNotifications((prev) =>
      prev.map((n) => (n._id === notification._id ? notification : n))
    );
  };

  const respondToFamilyRequest = (notificationId, accept) => {
    socket.emit("respond-family-request", { notificationId, accept });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        respondToFamilyRequest,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
