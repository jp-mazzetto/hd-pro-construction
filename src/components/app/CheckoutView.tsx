import AppSeo from "../AppSeo";
import CheckoutPage from "../CheckoutPage";

interface CheckoutViewProps {
  planTier: string;
  onBack: () => void;
}

const CheckoutView = ({ planTier, onBack }: CheckoutViewProps) => (
  <>
    <AppSeo />
    <div className="min-h-screen overflow-x-hidden font-sans text-gray-900 selection:bg-orange-600 selection:text-white">
      <CheckoutPage planTier={planTier} onBack={onBack} />
    </div>
  </>
);

export default CheckoutView;
