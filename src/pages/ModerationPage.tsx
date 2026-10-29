import { useState } from "react";
import { Link } from "react-router";
import { usePreview } from "../app/usePreview";
import type { Report } from "../data/demo";
import {
  DataState,
  Dialog,
  EmptyState,
  Notice,
  PageHeading,
} from "../components/Ui";

export function ModerationPage() {
  const { reports, products, resolveReport, restoreProduct } = usePreview();
  const [filter, setFilter] = useState("pendiente");
  const [confirm, setConfirm] = useState<{
    report: Report;
    action: "oculto" | "descartado";
  } | null>(null);
  const [feedback, setFeedback] = useState("");
  const selected = reports.filter(
    (report) => filter === "todos" || report.status === filter,
  );
  return (
    <div className="container inner-page">
      <PageHeading
        eyebrow="CUIDAMOS LA COMUNIDAD"
        title="Cada reporte merece una revisión."
        description="Una vista del futuro espacio de moderación de TradeNet."
      />
      <Notice>
        Vista administrativa de ejemplo, abierta para revisar el diseño. No
        otorga permisos reales ni actúa sobre personas o publicaciones reales.
      </Notice>
      <div className="moderation-stats">
        <div>
          <strong>
            {reports.filter((report) => report.status === "pendiente").length}
          </strong>
          <span>Pendientes</span>
        </div>
        <div>
          <strong>{products.filter((product) => product.hidden).length}</strong>
          <span>Publicaciones ocultas</span>
        </div>
        <div>
          <strong>
            {reports.filter((report) => report.status !== "pendiente").length}
          </strong>
          <span>Revisados</span>
        </div>
      </div>
      <div className="catalog-toolbar">
        <h2>Reportes</h2>
        <label className="sort-control">
          <span>Ver</span>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filtrar reportes"
          >
            <option value="pendiente">Pendientes</option>
            <option value="oculto">Con publicación oculta</option>
            <option value="descartado">Descartados</option>
            <option value="todos">Todos</option>
          </select>
        </label>
      </div>
      {feedback && <Notice>{feedback}</Notice>}
      <DataState
        emptyTitle="Todo tranquilo por aquí"
        emptyDescription="No hay reportes por revisar en esta vista."
      >
        {selected.length ? (
          <div className="report-list">
            {selected.map((report) => {
              const product = products.find(
                (item) => item.id === report.productId,
              );
              return (
                <article className="panel report-card" key={report.id}>
                  <div className="section-heading">
                    <div>
                      <span className="pill">
                        {report.status === "pendiente"
                          ? "Pendiente"
                          : report.status === "oculto"
                            ? "Publicación ocultada"
                            : "Descartado"}
                      </span>
                      <h3>
                        {product?.deleted
                          ? "Publicación retirada"
                          : (product?.title ?? "Publicación no disponible")}
                      </h3>
                    </div>
                    {product && !product.deleted && (
                      <Link
                        className="text-link"
                        to={`/productos/${product.id}`}
                      >
                        Ver publicación ↗
                      </Link>
                    )}
                  </div>
                  <p>
                    <strong>Motivo:</strong> {report.reason}
                  </p>
                  <p className="helper-text">
                    {report.detail || "Sin detalles adicionales."}
                  </p>
                  {report.status === "pendiente" && (
                    <div className="form-actions">
                      <button
                        className="button button-outline button-small"
                        onClick={() =>
                          setConfirm({ report, action: "descartado" })
                        }
                      >
                        Descartar reporte
                      </button>
                      <button
                        className="button button-dark button-small"
                        onClick={() => setConfirm({ report, action: "oculto" })}
                      >
                        Ocultar publicación
                      </button>
                    </div>
                  )}
                  {product?.hidden && (
                    <button
                      className="button button-outline button-small"
                      onClick={() => {
                        restoreProduct(product.id);
                        setFeedback(
                          "Visibilidad restaurada en la demostración. Se conserva la resolución anterior del reporte.",
                        );
                      }}
                    >
                      Restaurar visibilidad
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Todo tranquilo por aquí"
            description="No hay reportes con el estado seleccionado."
          />
        )}
      </DataState>
      {confirm && (
        <Dialog
          title={
            confirm.action === "oculto"
              ? "¿Ocultar esta publicación?"
              : "¿Descartar este reporte?"
          }
          onClose={() => setConfirm(null)}
        >
          <p className="dialog-description">
            {confirm.action === "oculto"
              ? "La publicación dejará de aparecer en el catálogo local. Una edición del vendedor no restaurará su visibilidad."
              : "Se marcará como revisado y la publicación conservará su visibilidad actual."}
          </p>
          <div className="form-actions">
            <button
              className="button button-outline"
              onClick={() => setConfirm(null)}
            >
              Cancelar
            </button>
            <button
              className="button button-dark"
              onClick={() => {
                resolveReport(confirm.report.id, confirm.action);
                setFeedback("Revisión aplicada a los datos de ejemplo.");
                setConfirm(null);
              }}
            >
              Confirmar revisión
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
