import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { usePreview } from "../app/usePreview";
import type { Product, ProductStatus } from "../data/demo";
import { isVisible, money } from "../lib/catalog";
import { ProductVisual } from "../components/ProductVisual";
import { ProductCard } from "../components/ProductCard";
import {
  DataState,
  Dialog,
  EmptyState,
  Notice,
  PageHeading,
} from "../components/Ui";
import { Icon } from "../components/Icon";

export function FavoritesPage() {
  const { products, favorites, toggleFavorite } = usePreview();
  const saved = products.filter((product) => favorites.includes(product.id));
  const available = saved.filter(
    (product) => isVisible(product) && product.status === "activa",
  );
  const unavailable = saved.filter(
    (product) => !isVisible(product) || product.status !== "activa",
  );
  return (
    <>
      <PageHeading
        title="Eso que no quieres perder de vista."
        description="Tus favoritos, listos para volver a encontrarlos."
      />
      <DataState
        emptyTitle="Tu próximo favorito te espera"
        emptyDescription="Guarda productos con el corazón para encontrarlos en este espacio."
      >
        {!saved.length ? (
          <EmptyState
            title="Tu próximo favorito te espera"
            description="Guarda productos con el corazón para encontrarlos en este espacio."
            action={
              <Link className="button button-dark" to="/explorar">
                Explorar productos
              </Link>
            }
          />
        ) : (
          <>
            <div className="product-grid account-product-grid">
              {available.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>
            {unavailable.map((product) => (
              <div className="unavailable-favorite" key={product.id}>
                <div>
                  <strong>Publicación no disponible</strong>
                  <p>Este favorito se vendió o fue retirado del catálogo.</p>
                </div>
                <button
                  className="subtle-button"
                  onClick={() => toggleFavorite(product.id)}
                >
                  Quitar de favoritos
                </button>
              </div>
            ))}
          </>
        )}
      </DataState>
    </>
  );
}
export function ListingsPage() {
  const { ownProducts, changeStatus, deleteProduct } = usePreview();
  const [params, setParams] = useSearchParams();
  const [confirmation, setConfirmation] = useState<{
    product: Product;
    action: "delete" | "sold";
  } | null>(null);
  const [feedback, setFeedback] = useState("");
  const status = params.get("estado") ?? "todas";
  const shown = ownProducts.filter(
    (product) => status === "todas" || product.status === status,
  );
  const tabs: { value: string; label: string }[] = [
    { value: "todas", label: "Todas" },
    { value: "activa", label: "Activas" },
    { value: "pausada", label: "Pausadas" },
    { value: "vendida", label: "Vendidas" },
  ];
  return (
    <>
      <PageHeading
        title="Lo que vendes, en un solo lugar."
        description="Administra tus publicaciones y dales una nueva oportunidad."
        action={
          <Link className="button button-dark button-small" to="/publicar">
            <Icon name="plus" size={18} />
            Publicar
          </Link>
        }
      />
      {(params.has("guardado") || feedback) && (
        <Notice>
          {feedback ||
            "Publicación guardada en la demostración local. Se reiniciará al recargar."}
        </Notice>
      )}
      <nav className="tabs" aria-label="Estado de mis publicaciones">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            aria-pressed={status === tab.value}
            className={status === tab.value ? "active" : ""}
            onClick={() => {
              const next = new URLSearchParams(params);
              next.set("estado", tab.value);
              next.delete("guardado");
              setParams(next);
            }}
          >
            {tab.label}{" "}
            <span>
              {
                ownProducts.filter(
                  (product) =>
                    tab.value === "todas" || product.status === tab.value,
                ).length
              }
            </span>
          </button>
        ))}
      </nav>
      <DataState
        emptyTitle="Aquí empieza tu próxima venta"
        emptyDescription="Cuando publiques un producto, podrás administrarlo desde este espacio."
      >
        {shown.length ? (
          <div className="listing-list">
            {shown.map((product) => (
              <article className="listing-row" key={product.id}>
                <div className="listing-thumb">
                  <ProductVisual product={product} />
                </div>
                <div className="listing-information">
                  <div className="detail-tags">
                    <span className={`pill status-${product.status}`}>
                      {product.hidden
                        ? "Oculta por moderación"
                        : product.status === "activa"
                          ? "Activa"
                          : product.status === "pausada"
                            ? "Pausada"
                            : "Vendida"}
                    </span>
                  </div>
                  <h2>{product.title}</h2>
                  {product.hidden && (
                    <p className="helper-text">
                      Motivo de moderación:{" "}
                      {product.moderationReason ?? "Revisión de la publicación"}
                    </p>
                  )}
                  <p>
                    {money(product.price)} <span>· {product.city}</span>
                  </p>
                  <div className="listing-actions">
                    <Link to={`/productos/${product.id}/editar`}>Editar</Link>
                    {!product.hidden && product.status !== "vendida" && (
                      <>
                        <button
                          onClick={() => {
                            const target: ProductStatus =
                              product.status === "activa"
                                ? "pausada"
                                : "activa";
                            changeStatus(product.id, target);
                            setFeedback(
                              target === "pausada"
                                ? "Publicación pausada en esta demostración."
                                : "Publicación reactivada en esta demostración.",
                            );
                          }}
                        >
                          {product.status === "activa" ? "Pausar" : "Reactivar"}
                        </button>
                        <button
                          onClick={() =>
                            setConfirmation({ product, action: "sold" })
                          }
                        >
                          Marcar vendida
                        </button>
                      </>
                    )}
                    <button
                      className="danger-text"
                      onClick={() =>
                        setConfirmation({ product, action: "delete" })
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title={
              ownProducts.length
                ? "No hay publicaciones en este estado"
                : "Aquí empieza tu próxima venta"
            }
            description="Publica algo nuevo o revisa las demás pestañas."
            action={
              <Link className="button button-dark" to="/publicar">
                Publicar un producto
              </Link>
            }
          />
        )}
      </DataState>
      {confirmation && (
        <Dialog
          title={
            confirmation.action === "delete"
              ? "¿Eliminar esta publicación?"
              : "¿Ya encontraste un comprador?"
          }
          onClose={() => setConfirmation(null)}
        >
          <p className="dialog-description">{confirmation.product.title}</p>
          <p className="helper-text">
            {confirmation.action === "delete"
              ? "Se retirará del catálogo de ejemplo. Las conversaciones anteriores conservarán una referencia al producto."
              : "Dejará de aparecer entre los productos disponibles. Las conversaciones anteriores se conservarán."}
          </p>
          <div className="form-actions">
            <button
              className="button button-outline"
              onClick={() => setConfirmation(null)}
            >
              Cancelar
            </button>
            <button
              className={`button ${confirmation.action === "delete" ? "button-danger" : "button-dark"}`}
              onClick={() => {
                if (confirmation.action === "delete")
                  deleteProduct(confirmation.product.id);
                else changeStatus(confirmation.product.id, "vendida");
                setFeedback(
                  confirmation.action === "delete"
                    ? "Publicación eliminada de la demostración."
                    : "Producto marcado como vendido en la demostración.",
                );
                setConfirmation(null);
              }}
            >
              Confirmar{" "}
              {confirmation.action === "delete" ? "eliminación" : "venta"}
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
