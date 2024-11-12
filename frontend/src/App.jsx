import { useAuth } from "./context/AuthContext";
import { GlobalProvider } from "./providers/GlobalProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Photos from "./pages/Photos";
import Family from "./pages/Family";
import Profile from "./pages/Profile";
import { Routes, Route, Navigate } from "react-router-dom";

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navbar />}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/events" />}
          />
          <Route
            path="/register"
            element={
              !isAuthenticated ? <Register /> : <Navigate to="/events" />
            }
          />
          <Route
            path="/events"
            element={<ProtectedRoute component={Events} />}
          />
          <Route
            path="/events/:id"
            element={<ProtectedRoute component={EventDetails} />}
          />
          <Route
            path="/photos"
            element={<ProtectedRoute component={Photos} />}
          />
          <Route
            path="/family"
            element={<ProtectedRoute component={Family} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute component={Profile} />}
          />
          <Route path="/" element={<Navigate to="/events" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <GlobalProvider>
      <AppContent />
    </GlobalProvider>
  );
}

export default App;
