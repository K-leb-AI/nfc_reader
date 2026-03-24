import { createBrowserRouter } from "react-router-dom";
import App from "./src/App";
import EmployeeProfile from "./src/pages/EmployeeCard";
import NoPage from "./src/components/NoPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/employee/:id",
        element: <EmployeeProfile />,
      },
    ],
  },
  {
    path: "*",
    element: <NoPage />,
  },
]);

export default router;
