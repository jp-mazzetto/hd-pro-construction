import { createBrowserRouter } from "react-router-dom";

import RootLayout from "./layouts/RootLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import AdminProtectedLayout from "./layouts/AdminProtectedLayout";
import HomePage from "./pages/HomePage";
import PlansPage from "./pages/PlansPage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutResultPage from "./pages/CheckoutResultPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";

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
          { path: "subscriptions/:id", element: <DashboardPage section="subscription-detail" /> },
          { path: "properties", element: <DashboardPage section="properties" /> },
          { path: "billing", element: <DashboardPage section="billing" /> },
          { path: "schedule", element: <DashboardPage section="schedule" /> },
          { path: "schedule/setup/:id", element: <DashboardPage section="schedule-setup" /> },
          { path: "settings", element: <DashboardPage section="settings" /> },
        ],
      },

      // Protected routes (admin)
      {
        path: "/admin",
        element: <AdminProtectedLayout />,
        children: [
          { index: true, element: <AdminPage section="visit-calendar" /> },
        ],
      },
    ],
  },
]);

export default router;
