import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layouts/Layouts";
import Dashboard from "./pages/Dashboard";
import BotEditor from "./pages/BotEditor";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import CreateBot from './components/CreateBot';
import BotView from "./pages/BotView";
import { Toaster } from "react-hot-toast";
import NotFound from "./components/NotFound";
import HowToMakeBot from "./pages/Howtomakebotguide";
import Footer from "./pages/Footer";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <BrowserRouter>

      <AuthProvider>
        <ScrollToTop />

        <Toaster position="top-right" reverseOrder={false} />
        <Routes>

          {/* Protected Layout */}
          <Route

            element={
              <ProtectedRoute>
                <Layout />
                <Footer />

              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-bot" element={<CreateBot/>} />
            <Route path="/bot/:id" element={<BotView />} />
            <Route path="/bot/:id/edit" element={<BotEditor/>} />
            <Route path="/bot/:id/analytics" element={<Analytics />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/how-to-make-bot" element={<HowToMakeBot />} />
          </Route>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

{/*  */ }