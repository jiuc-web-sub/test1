import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./components/auth/AuthLayout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Trash from "./pages/Trash";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'tasks', element: <Tasks /> },
      { path: 'trash', element: <Trash /> },
      { path: 'settings', element: <Settings /> }
    ]
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> }
]);