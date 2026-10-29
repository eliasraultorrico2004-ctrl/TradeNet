import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router";
import { usePreview } from "../app/usePreview";
import { isAvailable } from "../lib/catalog";
import { readImage } from "../lib/images";
import {
  Avatar,
  DataState,
  EmptyState,
  Notice,
  PageHeading,
} from "../components/Ui";
import { ProductCard } from "../components/ProductCard";

export function PublicProfilePage() {
  const { id } = useParams();
  const { getProfile, products } = usePreview();
  const seller = getProfile(id ?? "");
  if (!seller)
    return (
      <div className="container inner-page">
        <EmptyState
          title="No encontramos este perfil"
          headingLevel={1}
          description="El enlace no corresponde a un perfil de esta demostración."
          action={
            <Link className="button button-dark" to="/explorar">
              Volver al catálogo
            </Link>
          }
        />
      </div>
    );
  const listings = products.filter(
    (item) => item.sellerId === seller.id && isAvailable(item),
  );
  return (
    <div className="container inner-page">
      <DataState>
        <div className="public-profile-heading">
          <Avatar name={seller.name} src={seller.avatar} large />
          <div>
            <p className="eyebrow">CONOCE A LA COMUNIDAD</p>
            <h1>{seller.name}</h1>
            <p className="helper-text">
              En TradeNet desde{" "}
              {new Intl.DateTimeFormat("es-BO", {
                month: "long",
                year: "numeric",
              }).format(new Date(`${seller.joined}T12:00:00`))}
            </p>
          </div>
          <span className="pill">Perfil de ejemplo</span>
        </div>
        <div className="section-heading">
          <h2>Sus publicaciones</h2>
          <span className="helper-text">{listings.length} disponibles</span>
        </div>
        {listings.length ? (
          <div className="product-grid">
            {listings.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Todavía no tiene publicaciones activas"
            description="Los próximos productos de este vendedor aparecerán aquí."
          />
        )}
      </DataState>
    </div>
  );
}

export function MyProfilePage() {
  const { profile, setProfile } = usePreview();
  const [avatar, setAvatar] = useState(profile.avatar);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(false);
  const [reading, setReading] = useState(false);
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name")).trim();
    if (name.length < 2) {
      setError(true);
      setFeedback(
        "El nombre debe tener al menos 2 caracteres, sin contar espacios externos.",
      );
      return;
    }
    setProfile({ ...profile, name, avatar });
    setError(false);
    setFeedback(
      "Perfil de ejemplo actualizado. El cambio dura hasta que recargues la página.",
    );
  }
  return (
    <>
      <PageHeading
        title="Un perfil, muchas oportunidades."
        description="Así te verá la comunidad al encontrar tus publicaciones."
      />
      <DataState>
        <form className="panel stack-form" onSubmit={save}>
          <div className="profile-avatar-editor">
            <Avatar name={profile.name} src={avatar} large />
            <div>
              <label className="button button-outline button-small file-label">
                {reading ? "Leyendo imagen…" : "Cambiar imagen"}
                <input
                  className="sr-only"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={reading}
                  onChange={async (event) => {
                    const file = event.currentTarget.files?.[0];
                    event.currentTarget.value = "";
                    if (!file) return;
                    setReading(true);
                    try {
                      setAvatar(await readImage(file));
                      setFeedback("");
                    } catch (cause) {
                      setError(true);
                      setFeedback(
                        cause instanceof Error
                          ? cause.message
                          : "No pudimos leer la imagen.",
                      );
                    } finally {
                      setReading(false);
                    }
                  }}
                />
              </label>
              <p className="helper-text">JPEG, PNG o WebP · Máximo 5 MB</p>
              {avatar && (
                <button
                  type="button"
                  className="subtle-button"
                  onClick={() => setAvatar("")}
                >
                  Quitar imagen
                </button>
              )}
            </div>
          </div>
          <div className="field">
            <label htmlFor="profile-name">Nombre visible</label>
            <input
              id="profile-name"
              name="name"
              required
              minLength={2}
              maxLength={60}
              defaultValue={profile.name}
            />
            <small>Aparece en tu perfil y tus publicaciones.</small>
          </div>
          <div className="privacy-note">
            <strong>Tu privacidad primero.</strong>
            <p>
              El perfil público muestra tu nombre, imagen y publicaciones. Tu
              correo y tus conversaciones serán privados.
            </p>
          </div>
          {feedback && <Notice error={error}>{feedback}</Notice>}
          <div className="form-actions">
            <Link className="text-link" to={`/usuarios/${profile.id}`}>
              Ver mi perfil público ↗
            </Link>
            <button className="button button-dark" disabled={reading}>
              Guardar cambios de ejemplo
            </button>
          </div>
        </form>
      </DataState>
    </>
  );
}
