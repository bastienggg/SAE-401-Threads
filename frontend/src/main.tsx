import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./routes/Layout";
import Root from "./routes/Root";
import Login from "./routes/Login";
import Home from "./routes/Home";
import Signup from "./routes/Signup";
import Verify from "./routes/Verify";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import "./index.css";
import Backoffice from "./routes/Backoffice";
import ProtectedBackoffice from "./components/protetedBackoffice/protetedBackoffice"
import ProfilePage from "./routes/Profil";
import ModifyProfile from "./routes/ModifyProfil";
import UserProfilePage from "./routes/UserProfilePage"; // Importez le composant de la page de profil utilisateur

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Root />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "verify",
        element: <Verify />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "profil",
        element: <ProfilePage />,
      },
      {
        path: "profile/:userId", // Nouvelle route dynamique pour les profils d'autres utilisateurs
        element: <UserProfilePage />, // Composant pour afficher le profil d'un utilisateur
      },
      {
        path: "modify",
        element: <ModifyProfile />,
      },
      {
        path: "backoffice",
        element: (
          <ProtectedBackoffice>
            <Backoffice />
          </ProtectedBackoffice>
        ),
      },
    ],
  },
]);

const rootElement = document.querySelector("#root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
} else {
  console.error("No root element found");
}
