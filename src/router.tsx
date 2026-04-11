import { lazy, Suspense, type ComponentType, type ReactNode } from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import RootLayout from "./layouts/RootLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import AdminProtectedLayout from "./layouts/AdminProtectedLayout";
import PageFallback from "./components/PageFallback";

const HomePage = lazy(() => import("./pages/HomePage"));
const PlansPage = lazy(() => import("./pages/PlansPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const CheckoutResultPage = lazy(() => import("./pages/CheckoutResultPage"));
const ContractPage = lazy(() => import("./pages/ContractPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const withSuspense = (node: ReactNode) => (
  <Suspense fallback={<PageFallback />}>{node}</Suspense>
);

const lazyComponent = (Component: ComponentType) => () => withSuspense(<Component />);

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: lazyComponent(NotFoundPage),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: lazyComponent(HomePage),
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services",
  component: lazyComponent(ServicesPage),
});

const plansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/plans",
  component: lazyComponent(PlansPage),
});

const contractRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contract",
  component: lazyComponent(ContractPage),
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: lazyComponent(CheckoutPage),
});

const checkoutSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/success",
  component: () => withSuspense(<CheckoutResultPage status="success" />),
});

const checkoutCancelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cancel",
  component: () => withSuspense(<CheckoutResultPage status="cancel" />),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: ProtectedLayout,
});

const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/",
  component: () => withSuspense(<DashboardPage section="overview" />),
});

const dashboardSubscriptionDetailRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "subscriptions/$id",
  component: () => withSuspense(<DashboardPage section="subscription-detail" />),
});

const dashboardPropertiesRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "properties",
  component: () => withSuspense(<DashboardPage section="properties" />),
});

const dashboardBillingRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "billing",
  component: () => withSuspense(<DashboardPage section="billing" />),
});

const dashboardScheduleRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "schedule",
  component: () => withSuspense(<DashboardPage section="schedule" />),
});

const dashboardScheduleSetupRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "schedule/setup/$id",
  component: () => withSuspense(<DashboardPage section="schedule-setup" />),
});

const dashboardSettingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "settings",
  component: () => withSuspense(<DashboardPage section="settings" />),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminProtectedLayout,
});

const adminIndexRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/",
  component: () => withSuspense(<AdminPage section="visit-calendar" />),
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/404",
  component: lazyComponent(NotFoundPage),
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  servicesRoute,
  plansRoute,
  contractRoute,
  checkoutRoute,
  checkoutSuccessRoute,
  checkoutCancelRoute,
  dashboardRoute.addChildren([
    dashboardIndexRoute,
    dashboardSubscriptionDetailRoute,
    dashboardPropertiesRoute,
    dashboardBillingRoute,
    dashboardScheduleRoute,
    dashboardScheduleSetupRoute,
    dashboardSettingsRoute,
  ]),
  adminRoute.addChildren([adminIndexRoute]),
  notFoundRoute,
]);

export const createAppBrowserRouter = () =>
  createRouter({
    routeTree,
    defaultPreload: "intent",
  });

export const createAppMemoryRouter = (pathname: string) =>
  createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [pathname],
    }),
    isServer: true,
    origin: "https://hdproconstruction.com",
    defaultPreload: "intent",
  });

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppBrowserRouter>;
  }
}
