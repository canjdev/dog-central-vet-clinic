import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface EmailVerificationPageProps {
  email: string;
  onVerificationComplete: () => void;
}

export default function EmailVerificationPage({
  email,
  onVerificationComplete,
}: EmailVerificationPageProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Here you would typically make an API call to verify the code
      // For this example, we'll simulate a successful verification
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsVerified(true);
      setTimeout(() => {
        onVerificationComplete();
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Verification error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Invalid verification code. Please try again."
      );
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError("");

    try {
      // Here you would typically make an API call to resend the verification code
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsResending(false);
      setCountdown(60); // Start a 60-second countdown
    } catch (err) {
      console.error("Resend code error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to resend verification code. Please try again."
      );
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8]">
        <Card className="w-full max-w-md mx-4 p-8 bg-white shadow-sm text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-4">
            Email Verified Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for verifying your email. You will be redirected to the
            dashboard shortly.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8]">
      <Card className="w-full max-w-md mx-4 p-8 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-center mb-8">
          Verify Your Email
        </h1>
        <p className="text-center text-gray-600 mb-6">
          We've sent a verification code to {email}. Please enter the code below
          to verify your email address.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="verificationCode"
              className="block text-sm font-medium text-gray-700"
            >
              Verification Code
            </label>
            <Input
              id="verificationCode"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your 6-digit code"
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-[#18181B] text-white hover:bg-[#18181B]/90"
          >
            Verify Email
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Button
            onClick={handleResendCode}
            disabled={isResending || countdown > 0}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {countdown > 0
              ? `Resend code in ${countdown}s`
              : isResending
              ? "Resending..."
              : "Resend verification code"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
