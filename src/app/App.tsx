import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import { Layout } from "../components/Layout";
import { HomePage } from "../pages/HomePage";
import { ExplorePage } from "../pages/ExplorePage";
import { NotFoundPage, PlaceholderPage } from "../pages/PlaceholderPage";

const upcomingPages = [
  {
    path: "/productos/:id",
    title: "Detalle del producto",
    description: "Todos los detalles para encontrar tu próximo hallazgo.",
  },
  {
    path: "/registro",
    title: "Únete a TradeNet",
    description: "Tu próximo hallazgo empieza con una cuenta.",
  },
  {
    path: "/ingresar",
    title: "Qué bueno verte de nuevo.",
    description: "Tu comunidad de compradores y vendedores te espera.",
  },
  {
    path: "/recuperar-acceso",
    title: "Recupera tu acceso",
    description: "Vuelve a conectar con tu cuenta.",
  },
  {
    path: "/actualizar-contrasena",
    title: "Elige una nueva contraseña",
    description: "Un nuevo comienzo para acceder a tu cuenta.",
  },
  {
    path: "/usuarios/:id",
    title: "Perfil del vendedor",
    description: "Conoce a la persona detrás de tus próximos hallazgos.",
  },
  {
    path: "/mi-perfil",
    title: "Mi perfil",
    description: "Un espacio para presentarte a la comunidad.",
  },
  {
    path: "/mis-publicaciones",
    title: "Mis publicaciones",
    description: "Todo lo que vendes, en un solo lugar.",
  },
  {
    path: "/publicar",
    title: "Dale una nueva historia.",
    description:
      "Publica tus productos nuevos y usados para conectar con compradores en Bolivia.",
  },
  {
    path: "/productos/:id/editar",
    title: "Editar publicación",
    description: "Mantén al día los detalles de tu producto.",
  },
  {
    path: "/favoritos",
    title: "Tus favoritos",
    description: "Guarda eso que te gustó para encontrarlo de nuevo.",
  },
  {
    path: "/mensajes",
    title: "Tus conversaciones",
    description: "Cada buena compra empieza con una conversación.",
  },
  {
    path: "/mensajes/:id",
    title: "Conversación",
    description: "Consulta los detalles y acuerda tu próxima compra.",
  },
  {
    path: "/admin/reportes",
    title: "Revisión de reportes",
    description: "Un espacio para cuidar a la comunidad TradeNet.",
  },
] as const;

export function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    const match = upcomingPages.find((page) =>
      new RegExp(`^${page.path.replace(/:[^/]+/g, "[^/]+")}/?$`).test(pathname),
    );
    const title =
      pathname === "/"
        ? "Compra y vende en Bolivia"
        : pathname === "/explorar"
          ? "Explorar"
          : (match?.title ?? "Página no encontrada");
    document.title = `${title} · TradeNet`;
  }, [pathname]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="explorar" element={<ExplorePage />} />
        {upcomingPages.map((page) => (
          <Route
            key={page.path}
            path={page.path}
            element={
              <PlaceholderPage
                title={page.title}
                description={page.description}
              />
            }
          />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
