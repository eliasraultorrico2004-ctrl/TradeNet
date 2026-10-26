import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { Icon } from "./Icon";
import { market } from "../config/market";

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
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
            <Link className="login-link" to="/ingresar">
              Ingresar
            </Link>
            <Link className="button button-dark button-small" to="/publicar">
              <Icon name="plus" size={18} /> Publicar
            </Link>
          </div>
        </div>
      </header>
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
