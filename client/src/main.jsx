import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import ArtForm from "./components/ArtForm";
import Entries from "./components/Entries";
import Entry from "./components/Entry";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ArtForm />,
  },
  {
    path: "/entries",
    element: <Entries />,
  },
  {
    path: "/entries/:id",
    element: <Entry />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
