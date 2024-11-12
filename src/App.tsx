import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VetClinicLanding from "./components/VetClinicLanding";
import LoginPage from "./components/LoginPage";
import { PetMedicalHistory } from "./components/PetMedicalHistory";
import { AdminDashboard } from "./components/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VetClinicLanding />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/medical-history" element={<PetMedicalHistory />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
