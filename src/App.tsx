import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import VetClinicLanding from "./components/VetClinicLanding";
import LoginPage from "./components/LoginPage";
import { PetMedicalHistory } from "./components/PetMedicalHistory";
import { AdminDashboard, type UserRole } from "./components/AdminDashboard";
import EmailVerificationPage from "./components/EmailVerificationPage";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userRole, setUserRole] = useState<UserRole>("staff");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate an API call or any initialization process
    const initializeApp = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
      // Here you would typically check for an existing session or perform any necessary setup
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const handleLogin = (user: {
    username: string;
    role: UserRole;
    email?: string;
  }) => {
    setUserEmail(user.email || "");
    setUserRole(user.role);
    setIsAuthenticated(true);
    // You might want to store the user info in a more global state management solution
  };

  const handleVerificationComplete = () => {
    // Handle verification completion, e.g., update user state
    console.log("Email verification completed");
    // You might want to update the user's verification status here
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<VetClinicLanding />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
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
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <AdminDashboard
                userRole={userRole}
                onLogout={() => setIsAuthenticated(false)}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/verify-email"
          element={
            <EmailVerificationPage
              email={userEmail}
              onVerificationComplete={handleVerificationComplete}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
