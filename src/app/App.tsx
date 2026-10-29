import { useEffect } from "react";
import { Route, Routes, useLocation, matchPath } from "react-router";
import { PreviewProvider } from "./PreviewContext";
import { Layout } from "../components/Layout";
import { AccountLayout } from "../components/AccountLayout";
import { HomePage } from "../pages/HomePage";
import { ExplorePage } from "../pages/ExplorePage";
import { ProductPage } from "../pages/ProductPage";
import { AuthPage } from "../pages/AuthPage";
import { PublicProfilePage, MyProfilePage } from "../pages/ProfilePage";
import { PublishPage } from "../pages/PublishPage";
import { FavoritesPage, ListingsPage } from "../pages/AccountPages";
import { MessagesPage } from "../pages/MessagesPage";
import { ModerationPage } from "../pages/ModerationPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export function App() {
  const { pathname } = useLocation();
  const pages = [
    { path: "/", title: "Compra y vende en Bolivia", element: <HomePage /> },
    { path: "/explorar", title: "Explorar", element: <ExplorePage /> },
    {
      path: "/productos/:id",
      title: "Detalle del producto",
      element: <ProductPage key={pathname} />,
    },
    {
      path: "/registro",
      title: "Crear cuenta",
      element: <AuthPage kind="register" key="register" />,
    },
    {
      path: "/ingresar",
      title: "Ingresar",
      element: <AuthPage kind="login" key="login" />,
    },
    {
      path: "/recuperar-acceso",
      title: "Recuperar acceso",
      element: <AuthPage kind="recover" key="recover" />,
    },
    {
      path: "/actualizar-contrasena",
      title: "Actualizar contraseña",
      element: <AuthPage kind="password" key="password" />,
    },
    {
      path: "/usuarios/:id",
      title: "Perfil del vendedor",
      element: <PublicProfilePage />,
    },
    {
      path: "/mi-perfil",
      title: "Mi perfil",
      element: (
        <AccountLayout>
          <MyProfilePage />
        </AccountLayout>
      ),
    },
    {
      path: "/mis-publicaciones",
      title: "Mis publicaciones",
      element: (
        <AccountLayout>
          <ListingsPage />
        </AccountLayout>
      ),
    },
    {
      path: "/publicar",
      title: "Publicar producto",
      element: <PublishPage key={pathname} />,
    },
    {
      path: "/productos/:id/editar",
      title: "Editar publicación",
      element: <PublishPage key={pathname} />,
    },
    {
      path: "/favoritos",
      title: "Favoritos",
      element: (
        <AccountLayout>
          <FavoritesPage />
        </AccountLayout>
      ),
    },
    {
      path: "/mensajes",
      title: "Mensajes",
      element: (
        <AccountLayout>
          <MessagesPage />
        </AccountLayout>
      ),
    },
    {
      path: "/mensajes/:id",
      title: "Conversación",
      element: (
        <AccountLayout>
          <MessagesPage />
        </AccountLayout>
      ),
    },
    {
      path: "/admin/reportes",
      title: "Moderación",
      element: <ModerationPage />,
    },
  ];
  const title =
    pages.find((page) => matchPath({ path: page.path, end: true }, pathname))
      ?.title ?? "Página no encontrada";
  useEffect(() => {
    document.title = `${title} · TradeNet`;
  }, [title]);
  return (
    <PreviewProvider>
      <Routes>
        <Route element={<Layout />}>
          {pages.map((page) => (
            <Route key={page.path} path={page.path} element={page.element} />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </PreviewProvider>
  );
}
