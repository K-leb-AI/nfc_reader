import { createBrowserRouter } from "react-router-dom";
import App from "./src/App";
import DisplayPage from "./src/pages/DisplayPage";
import NoPage from "./src/components/NoPage";
import LandingPage from "./src/pages/LandingPage";
import Signup from "./src/pages/Signup";
import Onboarding from "./src/pages/Onboarding";
import DashboardLayout from "./src/pages/dashboard/DashboardLayout";
import Home from "./src/pages/dashboard/home";
import Employee from "./src/pages/dashboard/Employee";
import Marketplace from "./src/pages/dashboard/Marketplace";
import Settings from "./src/pages/dashboard/Settings";
import ActivityLogs from "./src/pages/dashboard/Logs";
import OrderPage from "./src/pages/dashboard/OrderPage";
import Login from "./src/pages/Login";
import CustomOrder from "./src/pages/dashboard/CustomOrder";
import BlankOrder from "./src/pages/dashboard/BlankOrder";
import AttendanceCheckIn from "./src/pages/dashboard/Events";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/employee/:id",
        element: <DisplayPage />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/onboarding",
        element: <Onboarding />,
      },
      {
        path: "/order/marketplace",
        element: <Marketplace />,
      },
      {
        path: "/order/custom",
        element: <CustomOrder />,
      },
      {
        path: "/order/blank",
        element: <BlankOrder />,
      },

      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Home />,
          },
          {
            path: "/dashboard/employees",
            element: <Employee />,
          },
          {
            path: "/dashboard/settings",
            element: <Settings />,
          },
          {
            path: "/dashboard/logs",
            element: <ActivityLogs />,
          },
          {
            path: "/dashboard/events",
            element: <AttendanceCheckIn />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NoPage />,
  },
]);

export default router;
