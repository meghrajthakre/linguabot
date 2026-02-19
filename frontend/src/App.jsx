import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layouts/Layouts";
import Dashboard from "./pages/Dashboard";
import BotEditor from "./pages/BotEditor";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* layout wrap */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bot" element={<BotEditor />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        {/* without navbar but bg same */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
