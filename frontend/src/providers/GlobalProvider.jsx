import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../context/AuthContext";
import { UserProvider } from "../context/UserContext";
import { PhotoProvider } from "../context/PhotoContext";
import { EventProvider } from "../context/EventContext";
import { FamilyProvider } from "../context/FamilyContext";
import { SocketProvider } from "../context/SocketContext";
import { NotificationProvider } from "../context/NotificationContext";

export function GlobalProvider({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <UserProvider>
              <EventProvider>
                <FamilyProvider>
                  <PhotoProvider>
                    {children}
                    <Toaster position="top-right" />
                  </PhotoProvider>
                </FamilyProvider>
              </EventProvider>
            </UserProvider>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
