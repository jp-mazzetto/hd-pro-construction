import { CheckCircle, XCircle } from "lucide-react";

interface CheckoutResultProps {
  status: "success" | "cancel";
  hasLinkedProperty?: boolean | null;
  onClose: () => void;
  onScheduleSetup?: () => void;
}

const CheckoutResult = ({
  status,
  hasLinkedProperty,
  onClose,
  onScheduleSetup,
}: CheckoutResultProps) => {
  const isSuccess = status === "success";
  const isReadyForSchedule = hasLinkedProperty === true;

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
            ? isReadyForSchedule
              ? "Your payment is confirmed and your address is already linked. Set up your service schedule to finish."
              : "Your payment is confirmed. Link this plan to one of your addresses to finish setup."
            : "Your checkout was cancelled and no charges were made. You can subscribe anytime from the plans section."}
        </p>

        {isSuccess && onScheduleSetup ? (
          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={onScheduleSetup}
              className="w-full cursor-pointer bg-amber-400 py-4 font-bold text-gray-950 transition-all hover:opacity-90"
            >
              {isReadyForSchedule ? "Set Up Schedule" : "Link Address Now"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full cursor-pointer border border-gray-300 py-3 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-100"
            >
              I'll do this later
            </button>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default CheckoutResult;
