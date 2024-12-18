import React, { useState, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import api from "@/config/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post<{ isAuthenticated: boolean }>(
        "/api/auth/",
        { username, password },
      );

      console.log(response);

      if (response.status === 200) {
        login();
        navigate("/dashboard");
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8]">
      <Card className="w-full max-w-md mx-4 p-8 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-center mb-2">
          Login to Dog Central Veterinary Clinic & Grooming!
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Staff members login only!
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-[#18181B] text-white hover:bg-[#18181B]/90"
          >
            Login
          </Button>
          <p className="text-sm text-gray-600 text-center mt-2 mb-4">
            If you're a customer, please login through Google!
          </p>
          <Button className="w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
            <a
              href={`${import.meta.env.VITE_API_BASE_URL}/api/auth/google`}
              className="flex items-center gap-2"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.766 12.2764c0-.9175-.07-1.7935-.2135-2.6325H12.24v4.9515h6.4555c-.2765 1.4976-1.1235 2.7646-2.3955 3.6116v3.0024h3.8775c2.269-2.0891 3.5776-5.1666 3.5776-8.9329z"
                  fill="#4285F4"
                />
                <path
                  d="M12.2401 24c3.2414 0 5.9569-1.0738 7.9417-2.9184l-3.8775-3.0024c-1.0746.7198-2.4481 1.147-4.0642 1.147-3.1239 0-5.7697-2.1085-6.7116-4.9414H1.5347v3.1024C3.5094 21.2146 7.5574 24 12.2401 24z"
                  fill="#34A853"
                />
                <path
                  d="M5.5285 14.2776c-.2406-.7198-.3776-1.4976-.3776-2.2774 0-.7799.1371-1.5577.3776-2.2775V6.6203H1.5347C.5449 8.3393 0 10.3277 0 12.5002c0 2.1725.5449 4.1609 1.5347 5.8799l3.9938-3.1025z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.2401 5.2817c1.7645 0 3.3481.6068 4.5934 1.7935l3.4414-3.4414C18.2424 1.7699 15.5269.0005 12.2401.0005 7.5574.0005 3.5094 2.7859 1.5347 6.6203l3.9938 3.1024c.9419-2.8329 3.5877-4.941 6.7116-4.941z"
                  fill="#EA4335"
                />
              </svg>
              Login with Google
            </a>
          </Button>
        </form>
      </Card>
    </div>
  );
}

