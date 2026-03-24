import { Navigate, useSearchParams } from "react-router-dom";

import useAppHandlers from "../hooks/useAppHandlers";
import CheckoutView from "../components/app/CheckoutView";

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const { navigateToHome } = useAppHandlers();

  const planTier = searchParams.get("plan");

  if (!planTier) {
    return <Navigate to="/" replace />;
  }

  return <CheckoutView planTier={planTier} onBack={navigateToHome} />;
};

export default CheckoutPage;
