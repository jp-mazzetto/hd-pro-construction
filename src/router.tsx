import { createBrowserRouter } from "react-router-dom";

import RootLayout from "./layouts/RootLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import HomePage from "./pages/HomePage";
import PlansPage from "./pages/PlansPage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutResultPage from "./pages/CheckoutResultPage";
import DashboardPage from "./pages/DashboardPage";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public routes
      { path: "/", element: <HomePage /> },
      { path: "/plans", element: <PlansPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/success", element: <CheckoutResultPage status="success" /> },
      { path: "/cancel", element: <CheckoutResultPage status="cancel" /> },

      // Protected routes (dashboard)
      {
        path: "/dashboard",
        element: <ProtectedLayout />,
        children: [
          { index: true, element: <DashboardPage section="overview" /> },
          { path: "subscriptions", element: <DashboardPage section="subscriptions" /> },
          { path: "subscriptions/:id", element: <DashboardPage section="subscription-detail" /> },
          { path: "properties", element: <DashboardPage section="properties" /> },
          { path: "billing", element: <DashboardPage section="billing" /> },
          { path: "referrals", element: <DashboardPage section="referrals" /> },
          { path: "schedule", element: <DashboardPage section="schedule" /> },
          { path: "schedule/setup/:id", element: <DashboardPage section="schedule-setup" /> },
          { path: "settings", element: <DashboardPage section="settings" /> },
        ],
      },
    ],
  },
]);

export default router;
