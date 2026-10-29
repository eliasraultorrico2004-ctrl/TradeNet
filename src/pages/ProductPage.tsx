import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { usePreview } from "../app/usePreview";
import { myId, reportReasons } from "../data/demo";
import { categories } from "../config/market";
import { isAvailable, isVisible, money } from "../lib/catalog";
import { ProductVisual } from "../components/ProductVisual";
import { ProductCard } from "../components/ProductCard";
import {
  Avatar,
  DataState,
  Dialog,
  EmptyState,
  Notice,
} from "../components/Ui";
import { Icon } from "../components/Icon";

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    products,
    favorites,
    toggleFavorite,
    getProfile,
    startConversation,
    reportProduct,
  } = usePreview();
  const [selected, setSelected] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const product = products.find((item) => item.id === id);
  if (!product || !isVisible(product) || product.status === "pausada")
    return (
      <div className="container inner-page">
        <EmptyState
          title="Este producto no está disponible"
          headingLevel={1}
          description="La publicación pudo haber sido retirada o pausada. Puedes encontrar otras oportunidades en el catálogo."
          action={
            <Link className="button button-dark" to="/explorar">
              Explorar productos
            </Link>
          }
        />
      </div>
    );
  const seller = getProfile(product.sellerId)!;
  const own = product.sellerId === myId;
  const saved = favorites.includes(product.id);
  const related = products
    .filter(
      (item) =>
        item.id !== id &&
        item.category === product.category &&
        isAvailable(item),
    )
    .slice(0, 4);
  const gallerySize = product.photos.length || 2;
  function submitReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const sent = reportProduct(
      product!.id,
      String(form.get("reason")),
      String(form.get("detail") ?? ""),
    );
    setReportOpen(false);
    setFeedback(
      sent
        ? "Reporte añadido a la vista de moderación de ejemplo. No se envió a un servicio real."
        : "Ya tienes un reporte pendiente para este producto.",
    );
  }
  return (
    <div className="container inner-page product-detail-page" key={id}>
      <nav className="breadcrumbs" aria-label="Ubicación">
        <Link to="/explorar">Explorar</Link>
        <span>/</span>
        <Link to={`/explorar?categoria=${product.category}`}>
          {categories.find((item) => item.id === product.category)?.name}
        </Link>
        <span>/</span>
        <span>{product.title}</span>
      </nav>
      <DataState>
        <div className="product-detail-grid">
          <section className="product-gallery" aria-label="Fotos del producto">
            <div className="gallery-main">
              <ProductVisual
                product={product}
                photo={product.photos[selected]}
                variant={selected}
              />
              {product.status === "vendida" && (
                <span className="sold-overlay">Vendido</span>
              )}
            </div>
            <div className="gallery-thumbnails">
              {Array.from({ length: gallerySize }, (_, index) => (
                <button
                  key={index}
                  className={selected === index ? "selected" : ""}
                  aria-label={`Ver imagen ${index + 1}`}
                  aria-pressed={selected === index}
                  onClick={() => setSelected(index)}
                >
                  <ProductVisual
                    product={product}
                    photo={product.photos[index]}
                    variant={index}
                  />
                </button>
              ))}
            </div>
            {!product.photos.length && (
              <p className="helper-text">
                Ilustraciones de ejemplo; las publicaciones reales tendrán fotos
                del vendedor.
              </p>
            )}
          </section>
          <section className="product-info">
            <div className="detail-tags">
              <span className="pill">{product.condition}</span>
              <span className="pill pill-light">
                {product.status === "vendida" ? "Vendido" : "Disponible"}
              </span>
            </div>
            <h1>{product.title}</h1>
            <p className="detail-price">
              {money(product.price)} <span>BOB</span>
            </p>
            <p className="product-location">
              <Icon name="pin" size={17} />
              {product.city}, Bolivia
            </p>
            <hr />
            <Link className="seller-card" to={`/usuarios/${seller.id}`}>
              <Avatar name={seller.name} src={seller.avatar} />
              <div>
                <span>Publicado por</span>
                <strong>{seller.name}</strong>
                <span>Ver perfil del vendedor ↗</span>
              </div>
            </Link>
            {own ? (
              <Link
                className="button button-dark full-width"
                to={`/productos/${product.id}/editar`}
              >
                <Icon name="edit" size={18} /> Editar mi publicación
              </Link>
            ) : (
              <button
                className="button button-dark full-width"
                disabled={!isAvailable(product)}
                onClick={() => {
                  const conversation = startConversation(product.id);
                  if (conversation) navigate(`/mensajes/${conversation}`);
                }}
              >
                <Icon name="message" size={18} />
                {product.status === "vendida"
                  ? "Este producto ya se vendió"
                  : "Contactar vendedor"}
              </button>
            )}
            <button
              className="button button-outline full-width"
              aria-pressed={saved}
              onClick={() => toggleFavorite(product.id)}
            >
              <Icon name="heart" size={18} />
              {saved ? "Guardado en favoritos" : "Guardar en favoritos"}
            </button>
            <p className="contact-note">
              Conversa y acuerda el pago y la entrega directamente con el
              vendedor.
            </p>
            {!own && isAvailable(product) && (
              <button
                className="subtle-button"
                onClick={() => setReportOpen(true)}
              >
                Reportar esta publicación
              </button>
            )}
          </section>
        </div>
        <section className="description-section">
          <h2>Un poco más sobre este hallazgo</h2>
          <p>{product.description}</p>
        </section>
        {feedback && <Notice>{feedback}</Notice>}
        {related.length > 0 && (
          <section className="recent-section">
            <div className="section-heading">
              <h2>Más por descubrir</h2>
            </div>
            <div className="product-grid">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </DataState>
      {reportOpen && (
        <Dialog
          title="Reportar publicación"
          onClose={() => setReportOpen(false)}
        >
          <p className="helper-text">
            Ayúdanos a cuidar la comunidad. Este reporte solo se añadirá a la
            demostración local.
          </p>
          <form className="stack-form" onSubmit={submitReport}>
            <div className="field">
              <label htmlFor="report-reason">Motivo</label>
              <select id="report-reason" name="reason" required>
                {reportReasons.map((reason) => (
                  <option key={reason}>{reason}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="report-detail">
                Cuéntanos un poco más (opcional)
              </label>
              <textarea
                id="report-detail"
                name="detail"
                maxLength={1000}
                rows={4}
              />
            </div>
            <div className="form-actions">
              <button
                className="button button-outline"
                type="button"
                onClick={() => setReportOpen(false)}
              >
                Cancelar
              </button>
              <button className="button button-dark" type="submit">
                Añadir reporte de ejemplo
              </button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
