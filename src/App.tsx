import { useMemo } from "react";
import { RouterProvider } from "react-router-dom";
import { createAppBrowserRouter } from "./router";

const App = () => {
  const router = useMemo(() => createAppBrowserRouter(), []);
  return <RouterProvider router={router} />;
};

export default App;
