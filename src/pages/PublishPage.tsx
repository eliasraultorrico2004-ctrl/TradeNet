import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { usePreview } from "../app/usePreview";
import { cities, myId } from "../data/demo";
import { categories } from "../config/market";
import { money } from "../lib/catalog";
import { readImage } from "../lib/images";
import { ProductVisual } from "../components/ProductVisual";
import { Icon } from "../components/Icon";
import { DataState, EmptyState, Notice, PageHeading } from "../components/Ui";

export function PublishPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, saveProduct } = usePreview();
  const existing = products.find((item) => item.id === id);
  const [draft, setDraft] = useState({
    title: existing?.title ?? "",
    description: existing?.description ?? "",
    category: existing?.category ?? "",
    price: existing?.price.toString() ?? "",
    city: existing?.city ?? "",
    condition: existing?.condition ?? "Usado",
  });
  const [photos, setPhotos] = useState(existing?.photos ?? []);
  const [illustration, setIllustration] = useState(
    !!existing && !existing.photos.length,
  );
  const [error, setError] = useState("");
  const [reading, setReading] = useState(false);
  if (id && (!existing || existing.sellerId !== myId || existing.deleted))
    return (
      <div className="container inner-page">
        <EmptyState
          title="No puedes editar esta publicación"
          headingLevel={1}
          description="Desde tu espacio puedes administrar únicamente los artículos de tu cuenta de ejemplo."
          action={
            <Link className="button button-dark" to="/mis-publicaciones">
              Ver mis publicaciones
            </Link>
          }
        />
      </div>
    );
  const preview = {
    id: "vista-previa",
    title: draft.title || "El título de tu próximo hallazgo",
    description: draft.description,
    category: draft.category,
    price: Number(draft.price) || 0,
    condition: draft.condition,
    city: draft.city,
    sellerId: myId,
    status: existing?.status ?? "activa",
    visual: existing?.visual ?? "box",
    photos,
    createdAt: "",
  } as const;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = draft.title.trim();
    const description = draft.description.trim();
    const price = Number(draft.price);
    if (title.length < 5 || description.length < 20) {
      setError(
        "Escribe al menos 5 caracteres para el título y 20 para la descripción, sin contar los espacios externos.",
      );
      return;
    }
    if (
      !Number.isFinite(price) ||
      price <= 0 ||
      !/^\d+(\.\d{1,2})?$/.test(draft.price)
    ) {
      setError("Ingresa un precio positivo con hasta dos decimales.");
      return;
    }
    if (!photos.length && !illustration) {
      setError(
        "Añade al menos una foto o elige la ilustración de ejemplo para probar la publicación.",
      );
      return;
    }
    const saved = saveProduct(
      {
        title,
        description,
        category: draft.category,
        price,
        condition: draft.condition,
        city: draft.city,
        status: existing?.status ?? "activa",
        visual: existing?.visual ?? "box",
        photos,
      },
      id,
    );
    if (saved) navigate(`/mis-publicaciones?guardado=${saved}`);
    else
      setError(
        "No pudimos guardar esta publicación de ejemplo. Tus datos siguen en el formulario.",
      );
  }
  return (
    <div className="container inner-page">
      <PageHeading
        eyebrow="DALE UNA NUEVA HISTORIA"
        title={
          id
            ? "Tu publicación, al día."
            : "Lo tuyo puede ser su próximo hallazgo."
        }
        description="Los detalles hacen la diferencia. Cuenta qué vendes y muestra cómo es."
      />
      <DataState>
        <form className="publish-layout" onSubmit={submit}>
          <div className="stack-form">
            <section className="panel">
              <div className="form-section-title">
                <span>01</span>
                <div>
                  <h2>Cuéntanos qué vendes</h2>
                  <p>Un buen título hace más fácil encontrarte.</p>
                </div>
              </div>
              <div className="stack-form">
                <div className="field">
                  <label htmlFor="product-title">Título</label>
                  <input
                    id="product-title"
                    value={draft.title}
                    onChange={(event) =>
                      setDraft({ ...draft, title: event.target.value })
                    }
                    required
                    minLength={5}
                    maxLength={100}
                    placeholder="Ej. Bicicleta urbana aro 26"
                  />
                  <small>{draft.title.length}/100 caracteres</small>
                </div>
                <div className="field">
                  <label htmlFor="product-description">Descripción</label>
                  <textarea
                    id="product-description"
                    value={draft.description}
                    onChange={(event) =>
                      setDraft({ ...draft, description: event.target.value })
                    }
                    required
                    minLength={20}
                    maxLength={3000}
                    rows={5}
                    placeholder="Estado, medidas, accesorios incluidos y todo lo que ayude a decidir."
                  />
                  <small>
                    {draft.description.length}/3.000 caracteres · Mínimo 20
                  </small>
                </div>
                <div className="form-row">
                  <div className="field">
                    <label htmlFor="product-category">Categoría</label>
                    <select
                      id="product-category"
                      required
                      value={draft.category}
                      onChange={(event) =>
                        setDraft({ ...draft, category: event.target.value })
                      }
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="product-condition">Condición</label>
                    <select
                      id="product-condition"
                      value={draft.condition}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          condition: event.target.value as "Nuevo" | "Usado",
                        })
                      }
                    >
                      <option>Usado</option>
                      <option>Nuevo</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>
            <section className="panel">
              <div className="form-section-title">
                <span>02</span>
                <div>
                  <h2>Una imagen lo cambia todo</h2>
                  <p>Hasta 5 fotos. La primera será tu portada.</p>
                </div>
              </div>
              <label className="upload-area">
                <Icon name="upload" size={30} />
                <strong>
                  {reading ? "Preparando imágenes…" : "Selecciona tus fotos"}
                </strong>
                <span>JPEG, PNG o WebP · Hasta 5 MB por foto</span>
                <input
                  className="sr-only"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  disabled={reading}
                  onChange={async (event) => {
                    const files = Array.from(event.currentTarget.files ?? []);
                    event.currentTarget.value = "";
                    if (!files.length) return;
                    if (files.length + photos.length > 5) {
                      setError("Puedes añadir hasta 5 fotos por publicación.");
                      return;
                    }
                    setReading(true);
                    try {
                      const images = await Promise.all(files.map(readImage));
                      setPhotos((previous) => [...previous, ...images]);
                      setIllustration(false);
                      setError("");
                    } catch (cause) {
                      setError(
                        cause instanceof Error
                          ? cause.message
                          : "No pudimos leer las fotos.",
                      );
                    } finally {
                      setReading(false);
                    }
                  }}
                />
              </label>
              {photos.length > 0 && (
                <div className="photo-editor">
                  {photos.map((photo, index) => (
                    <div key={`${index}:${photo.slice(-30)}`}>
                      <img
                        src={photo}
                        alt={`Foto ${index + 1} de la publicación`}
                      />
                      <button
                        className="photo-remove"
                        type="button"
                        disabled={reading}
                        aria-label={`Quitar foto ${index + 1}`}
                        onClick={() =>
                          setPhotos(photos.filter((_, item) => item !== index))
                        }
                      >
                        <Icon name="close" size={14} />
                      </button>
                      <button
                        className="photo-cover"
                        type="button"
                        disabled={reading || index === 0}
                        onClick={() =>
                          setPhotos([
                            photo,
                            ...photos.filter((_, item) => item !== index),
                          ])
                        }
                      >
                        {index === 0 ? "Portada" : "Hacer portada"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {photos.length === 0 && (
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={illustration}
                    onChange={(event) => setIllustration(event.target.checked)}
                  />
                  Usar ilustración de ejemplo en esta demostración
                </label>
              )}
            </section>
            <section className="panel">
              <div className="form-section-title">
                <span>03</span>
                <div>
                  <h2>Precio y ubicación</h2>
                  <p>Una moneda. Más oportunidades cerca de ti.</p>
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="product-price">
                    Precio en bolivianos (Bs)
                  </label>
                  <input
                    id="product-price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={draft.price}
                    onChange={(event) =>
                      setDraft({ ...draft, price: event.target.value })
                    }
                    placeholder="0,00"
                  />
                </div>
                <div className="field">
                  <label htmlFor="product-city">Ciudad</label>
                  <select
                    id="product-city"
                    required
                    value={draft.city}
                    onChange={(event) =>
                      setDraft({ ...draft, city: event.target.value })
                    }
                  >
                    <option value="">Seleccionar ciudad</option>
                    {cities.map((city) => (
                      <option key={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="helper-text">
                Mostramos tu ciudad, nunca una dirección exacta.
              </p>
            </section>
            {existing?.hidden && (
              <Notice>
                La publicación está oculta por moderación. Editarla no la vuelve
                a mostrar en el catálogo.
              </Notice>
            )}
            {error && <Notice error>{error}</Notice>}
            <div className="form-actions">
              <Link className="button button-outline" to="/mis-publicaciones">
                Cancelar
              </Link>
              <button
                className="button button-dark"
                type="submit"
                disabled={reading}
              >
                {id
                  ? "Guardar cambios de ejemplo"
                  : "Publicar en la demostración"}
                <Icon name="arrow" size={18} />
              </button>
            </div>
          </div>
          <aside className="publish-preview">
            <p className="eyebrow">ASÍ SE VERÁ TU PRODUCTO</p>
            <div className="product-card">
              <ProductVisual product={preview} />
              <div className="product-card-body">
                <p className="product-price">{money(preview.price)}</p>
                <h3>{preview.title}</h3>
                <p className="product-location">
                  <Icon name="pin" size={14} />
                  {draft.city || "Tu ciudad"} · {draft.condition}
                </p>
              </div>
            </div>
            <p className="helper-text">
              Vista previa local. Esta publicación no se subirá a Internet.
            </p>
          </aside>
        </form>
      </DataState>
    </div>
  );
}
