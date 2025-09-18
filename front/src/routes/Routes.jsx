import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "../Layout/MainLayout/IndexLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import Postres from "../pages/Postres/Postres";
import Clientes from "../pages/Clientes/Clientes";
import Pedidos from "../pages/Pedidos/Pedidos";
import PostreView from "../pages/Postres/components/PostreView/PostreView";
import Insumos from "../pages/Insumos/Insumos";
import Plantillas from "../pages/Plantillas/Plantillas";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "postres", element: <Postres /> },
      { path: "usuarios", element: <Clientes /> },
      { path: "pedidos", element: <Pedidos /> },
      { path: "postres/:postre", element: <PostreView /> },
      { path: "insumos", element: <Insumos /> },
      { path: "plantillas", element: <Plantillas /> }

    ],
  },
]);

const MyRoutes = () => <RouterProvider router={router} />

export default MyRoutes;