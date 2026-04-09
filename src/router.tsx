import React, { lazy, Suspense } from "react";
import { createBrowserRouter, type RouteObject } from "react-router-dom";

import RootLayout from "./layouts/RootLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import AdminProtectedLayout from "./layouts/AdminProtectedLayout";

const HomePage = lazy(() => import("./pages/HomePage"));
const PlansPage = lazy(() => import("./pages/PlansPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const CheckoutResultPage = lazy(() => import("./pages/CheckoutResultPage"));
const ContractPage = lazy(() => import("./pages/ContractPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const PageFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950" />
);

const withSuspense = (element: React.ReactElement) => (
  <Suspense fallback={<PageFallback />}>{element}</Suspense>
);

export const appRoutes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      // Public routes
      { path: "/", element: withSuspense(<HomePage />) },
      { path: "/services", element: withSuspense(<ServicesPage />) },
      { path: "/plans", element: withSuspense(<PlansPage />) },
      { path: "/contract", element: withSuspense(<ContractPage />) },
      { path: "/checkout", element: withSuspense(<CheckoutPage />) },
      { path: "/success", element: withSuspense(<CheckoutResultPage status="success" />) },
      { path: "/cancel", element: withSuspense(<CheckoutResultPage status="cancel" />) },

      // Protected routes (dashboard)
      {
        path: "/dashboard",
        element: <ProtectedLayout />,
        children: [
          { index: true, element: withSuspense(<DashboardPage section="overview" />) },
          { path: "subscriptions/:id", element: withSuspense(<DashboardPage section="subscription-detail" />) },
          { path: "properties", element: withSuspense(<DashboardPage section="properties" />) },
          { path: "billing", element: withSuspense(<DashboardPage section="billing" />) },
          { path: "schedule", element: withSuspense(<DashboardPage section="schedule" />) },
          { path: "schedule/setup/:id", element: withSuspense(<DashboardPage section="schedule-setup" />) },
          { path: "settings", element: withSuspense(<DashboardPage section="settings" />) },
        ],
      },

      // Protected routes (admin)
      {
        path: "/admin",
        element: <AdminProtectedLayout />,
        children: [
          { index: true, element: withSuspense(<AdminPage section="visit-calendar" />) },
        ],
      },
      { path: "/404", element: withSuspense(<NotFoundPage />) },
      { path: "*", element: withSuspense(<NotFoundPage />) },
    ],
  },
];

export const createAppBrowserRouter = () => createBrowserRouter(appRoutes);
