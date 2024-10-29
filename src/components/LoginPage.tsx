import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export type UserRole = "customer" | "staff" | "admin";

interface LoginPageProps {
  onLogin: (username: string, role: UserRole) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
    // In a real application, you would validate the credentials here
    // For this example, we'll use a simple logic to determine the role
    let role: UserRole = "customer";
    if (username === "admin") {
      role = "admin";
    } else if (username === "staff") {
      role = "staff";
    }
    onLogin(username, role);
  };

  // const handleGoogleLogin = () => {
  //   // In a real application, you would implement Google OAuth here
  //   // For this example, we'll just log in as a customer
  //   onLogin("Google User", "customer");
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Login to Dog Central Veterinary Clinic & Grooming!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-4">
            <a
              href="https://management-system-backend-theta.vercel.app/api/auth/google"
              // onClick={handleGoogleLogin}
              className="w-full bg-white flex justify-center items-center rounded-lg py-2 text-gray-700 border border-gray-300 hover:bg-gray-50"
            >
              <FaGoogle className="mr-2" />
              Login with Google
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
