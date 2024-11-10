import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../context/AuthContext";
import { UserProvider } from "../context/UserContext";
import { PhotoProvider } from "../context/PhotoContext";
import { EventProvider } from "../context/EventContext";
import { FamilyProvider } from "../context/FamilyContext";

export function GlobalProvider({ children }) {
  return (
    <AuthProvider>
      <UserProvider>
        <PhotoProvider>
          <EventProvider>
            <FamilyProvider>
              <BrowserRouter>
                <Toaster position="top-right" />
                {children}
              </BrowserRouter>
            </FamilyProvider>
          </EventProvider>
        </PhotoProvider>
      </UserProvider>
    </AuthProvider>
  );
}
