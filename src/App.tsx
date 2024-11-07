import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import VetClinicLanding from "./components/VetClinicLanding";
import LoginPage from "./components/LoginPage";
import { PetMedicalHistory } from "./components/PetMedicalHistory";
import { AdminDashboard } from "./components/AdminDashboard";
import EmailVerificationPage from "./components/EmailVerificationPage";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  // const [userEmail, setUserEmail] = useState<string>("");
  // const [userRole, setUserRole] = useState<UserRole>("staff");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // const handleLogin = (user: {
  //   username: string;
  //   role: UserRole;
  //   email?: string;
  // }) => {
  //   setUserEmail(user.email || "");
  //   setUserRole(user.role);
  //   setIsAuthenticated(true);
  //   // You might want to store the user info in a more global state management solution
  // };

  const handleVerificationComplete = () => {
    // Handle verification completion, e.g., update user state
    console.log("Email verification completed");
    // You might want to update the user's verification status here
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<VetClinicLanding />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/medical-history"
          element={
            isAuthenticated ? (
              <PetMedicalHistory />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route element={<PrivateRoute />}>
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <AdminDashboard
                  userRole={"admin"}
                  onLogout={() => setIsAuthenticated(false)}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Route>
        <Route
          path="/verify-email"
          element={
            <EmailVerificationPage
              onVerificationComplete={handleVerificationComplete}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
