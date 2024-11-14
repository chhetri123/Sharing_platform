import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Photos from "./pages/Photos";
import Family from "./pages/Family";
import Dashboard from "./pages/Dashboard";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
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
              element={isAuthenticated ? <Events /> : <Navigate to="/login" />}
            />
            <Route
              path="/events/:id"
              element={
                isAuthenticated ? <EventDetails /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/photos"
              element={isAuthenticated ? <Photos /> : <Navigate to="/login" />}
            />
            <Route
              path="/family"
              element={isAuthenticated ? <Family /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
              }
            />
            <Route path="/" element={<Navigate to="/events" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
