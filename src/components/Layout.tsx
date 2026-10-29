import { useEffect, useRef } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useSearchParams,
} from "react-router";
import { Icon } from "./Icon";
import { market } from "../config/market";
import { usePreview } from "../app/usePreview";

export function Layout() {
  const { pathname } = useLocation();
  const [params, setParams] = useSearchParams();
  const { accountOpen, setAccountOpen, profile } = usePreview();
  const previousPath = useRef(pathname);
  const showStates = ![
    "/ingresar",
    "/registro",
    "/recuperar-acceso",
    "/actualizar-contrasena",
  ].includes(pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (previousPath.current !== pathname)
      document.getElementById("contenido")?.focus({ preventScroll: true });
    previousPath.current = pathname;
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <div className="market-strip">
        <span>Un nuevo lugar para comprar y vender.</span>
        <span>
          <Icon name="pin" size={14} /> {market.country}{" "}
          <span className="strip-divider">/</span> {market.currency}
        </span>
      </div>
      <header className="header">
        <div className="container header-inner">
          <Link className="brand" to="/" aria-label="TradeNet, inicio">
            <span className="brand-mark">
              t<span>↗</span>
            </span>
            TradeNet<span className="brand-dot">.</span>
          </Link>
          <nav className="main-nav" aria-label="Navegación principal">
            <NavLink to="/" end>
              Inicio
            </NavLink>
            <NavLink to="/explorar">Explorar</NavLink>
          </nav>
          <div className="header-actions">
            {!accountOpen && (
              <Link className="login-link" to="/ingresar">
                Ingresar
              </Link>
            )}
            <details className="account-menu" key={pathname}>
              <summary>
                <Icon name="user" size={18} />
                <span>
                  {accountOpen ? profile.name.split(" · ")[0] : "Mi espacio"}
                </span>
              </summary>
              <nav aria-label="Mi cuenta de ejemplo">
                <span className="menu-caption">CUENTA DE EJEMPLO</span>
                <Link to="/mi-perfil">Mi perfil</Link>
                <Link to="/mis-publicaciones">Mis publicaciones</Link>
                <Link to="/favoritos">Favoritos</Link>
                <Link to="/mensajes">Mensajes</Link>
                <Link to="/admin/reportes">Vista de moderación</Link>
                {accountOpen && (
                  <button onClick={() => setAccountOpen(false)}>
                    Salir de la vista de cuenta
                  </button>
                )}
              </nav>
            </details>
            <Link className="button button-dark button-small" to="/publicar">
              <Icon name="plus" size={18} /> Publicar
            </Link>
          </div>
        </div>
      </header>
      <div className="preview-banner">
        <div className="container preview-inner">
          <p>
            <strong>Vista de demostración</strong>
            <span>
              {" "}
              · Datos ficticios. Los cambios se reinician al recargar.
            </span>
          </p>
          {showStates && (
            <label>
              <span className="sr-only">Estado de demostración</span>
              <select
                aria-label="Estado de demostración"
                value={params.get("vista") ?? ""}
                onChange={(event) => {
                  const next = new URLSearchParams(params);
                  event.target.value
                    ? next.set("vista", event.target.value)
                    : next.delete("vista");
                  setParams(next);
                }}
              >
                <option value="">Vista normal</option>
                <option value="cargando">Probar carga</option>
                <option value="vacio">Probar vacío</option>
                <option value="error">Probar error</option>
              </select>
            </label>
          )}
        </div>
      </div>
      <main id="contenido" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <Link className="footer-brand" to="/">
            TradeNet.
          </Link>
          <span>Más oportunidades. Más cerca de ti.</span>
          <span>
            Hecho para {market.country} · Precios en {market.currencySymbol}
          </span>
        </div>
      </footer>
    </>
  );
}
