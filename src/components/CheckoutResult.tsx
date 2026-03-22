import { CheckCircle, XCircle } from "lucide-react";

interface CheckoutResultProps {
  status: "success" | "cancel";
  onClose: () => void;
}

const CheckoutResult = ({ status, onClose }: CheckoutResultProps) => {
  const isSuccess = status === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md bg-white p-10 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          {isSuccess ? (
            <CheckCircle size={36} className="text-lime-500" />
          ) : (
            <XCircle size={36} className="text-red-500" />
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          {isSuccess ? "Subscription Confirmed!" : "Checkout Cancelled"}
        </h2>

        <p className="mt-3 text-gray-600">
          {isSuccess
            ? "Your lawn maintenance plan is now active. We'll reach out shortly to schedule your first visit."
            : "Your checkout was cancelled and no charges were made. You can subscribe anytime from the plans section."}
        </p>

        <button
          type="button"
          onClick={onClose}
          className={`mt-8 w-full cursor-pointer py-4 font-bold transition-all ${
            isSuccess
              ? "bg-amber-400 text-gray-950 hover:opacity-90"
              : "border border-gray-300 text-gray-900 hover:bg-gray-100"
          }`}
        >
          {isSuccess ? "Got It" : "Back to Plans"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutResult;
