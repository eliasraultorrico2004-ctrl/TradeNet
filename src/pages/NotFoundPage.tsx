import { Link } from "react-router";
import { Icon } from "../components/Icon";

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
