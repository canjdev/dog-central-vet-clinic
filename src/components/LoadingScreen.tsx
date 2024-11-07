import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading...</h2>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while we prepare your experience.
        </p>
      </div>
    </div>
  );
}
