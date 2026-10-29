import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import { Link, useSearchParams } from "react-router";
import { Icon } from "./Icon";

export function PageHeading({
  eyebrow = "TU COMUNIDAD, MÁS CERCA",
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function EmptyState({
  title,
  description,
  action,
  headingLevel = 2,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  headingLevel?: 1 | 2;
}) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name="box" size={34} />
      </span>
      <Heading>{title}</Heading>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function Notice({
  children,
  error = false,
}: {
  children: ReactNode;
  error?: boolean;
}) {
  return (
    <div
      className={`notice ${error ? "notice-error" : ""}`}
      role={error ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
export function DataState({
  children,
  emptyTitle = "Todavía no hay nada por aquí",
  emptyDescription = "Cuando haya contenido, lo encontrarás en este espacio.",
}: {
  children: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const [params, setParams] = useSearchParams();
  const state = params.get("vista");
  if (state === "cargando")
    return (
      <div
        className="skeleton-grid"
        role="status"
        aria-label="Cargando contenido"
      >
        <span className="sr-only">Cargando contenido…</span>
        {[1, 2, 3].map((item) => (
          <div className="skeleton" key={item}>
            <div />
            <span />
            <span />
          </div>
        ))}
      </div>
    );
  if (state === "error")
    return (
      <EmptyState
        title="No pudimos cargar este espacio"
        description="Puedes intentarlo de nuevo. Tus cambios de esta demostración se conservarán mientras no recargues la página."
        action={
          <button
            className="button button-dark"
            onClick={() => {
              const next = new URLSearchParams(params);
              next.delete("vista");
              setParams(next);
            }}
          >
            Volver a intentar
          </button>
        }
      />
    );
  if (state === "vacio")
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={
          <Link className="text-link" to="/explorar">
            Explorar productos <Icon name="arrow" size={18} />
          </Link>
        }
      />
    );
  return <>{children}</>;
}
export function Avatar({
  name,
  src = "",
  large = false,
}: {
  name: string;
  src?: string;
  large?: boolean;
}) {
  return (
    <span className={`avatar ${large ? "avatar-large" : ""}`}>
      {src ? (
        <img src={src} alt={`Avatar de ${name}`} />
      ) : (
        <span aria-hidden="true">{name.slice(0, 1).toUpperCase()}</span>
      )}
    </span>
  );
}
export function Dialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      className="modal"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="modal-heading">
        <h2 id={id}>{title}</h2>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Cerrar ventana"
        >
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
