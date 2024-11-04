import VetClinicLanding from "./components/VetClinicLanding";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import { AdminDashboard } from "./components/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<VetClinicLanding />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/login" element={<LoginPage onLogin={() => {}} />} />
    </Routes>
  );
}

export default App;
