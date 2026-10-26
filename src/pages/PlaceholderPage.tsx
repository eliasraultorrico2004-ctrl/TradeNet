import { Link } from "react-router";
import { Icon } from "../components/Icon";

export function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="container inner-page">
      <p className="eyebrow">TU ESPACIO EN TRADENET</p>
      <h1>{title}</h1>
      <p className="page-description">{description}</p>
      <div className="empty-state">
        <span className="empty-icon">
          <Icon name="box" size={36} />
        </span>
        <h2>Estamos preparando este espacio</h2>
        <p>Esta sección estará disponible próximamente.</p>
        <Link className="button button-dark" to="/explorar">
          Explorar TradeNet <Icon name="arrow" size={18} />
        </Link>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="container inner-page">
      <p className="eyebrow">404 · PÁGINA NO ENCONTRADA</p>
      <h1>Por aquí todavía no hay nada.</h1>
      <p className="page-description">
        La dirección no existe o la página cambió de lugar.
      </p>
      <Link className="button button-dark" to="/">
        Volver al inicio <Icon name="arrow" size={18} />
      </Link>
    </div>
  );
}
