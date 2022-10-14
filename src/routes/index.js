import { lazy } from "react";

const Login = lazy(() => import("../views/Login"));
const Dashboard = lazy(() => import("../views/Dashboard"));

export const routes = {
  guest: [
    {
      name: "Login",
      element: <Login />,
      url: "/auth/login",
    },
  ],
  protected: [
    {
      name: "Dashboard",
      element: <Dashboard />,
      url: "/",
    },
  ],
};
