import { createBrowserRouter } from "react-router-dom";
import App from "./src/App";
import DisplayPage from "./src/pages/DisplayPage";
import EmployeeProfile from "./src/components/EmployeeCard";
import NoPage from "./src/components/NoPage";
import LandingPage from "./src/pages/LandingPage";

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
    ],
  },
  {
    path: "*",
    element: <NoPage />,
  },
]);

export default router;
