import VetClinicLanding from "./components/VetClinicLanding";
import { Route, Routes } from "react-router-dom";
import { AdminDashboard } from "./components/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<VetClinicLanding />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
