import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { usePreview } from "../app/usePreview";
import { safeDestination } from "../lib/catalog";
import { Icon } from "../components/Icon";
import { Notice } from "../components/Ui";

type AuthKind = "login" | "register" | "recover" | "password";
const copy = {
  login: {
    title: "Qué bueno verte de nuevo.",
    intro: "Entra y sigue encontrando nuevas oportunidades.",
    button: "Ingresar",
  },
  register: {
    title: "Tu próximo hallazgo empieza aquí.",
    intro: "Un espacio para comprar, vender y conectar en Bolivia.",
    button: "Crear cuenta",
  },
  recover: {
    title: "Volvamos a conectar.",
    intro: "Ingresa tu correo para recuperar el acceso a tu cuenta.",
    button: "Solicitar recuperación",
  },
  password: {
    title: "Un nuevo comienzo.",
    intro: "Elige una contraseña para volver a tu cuenta.",
    button: "Actualizar contraseña",
  },
};
export function AuthPage({ kind }: { kind: AuthKind }) {
  const [visible, setVisible] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setAccountOpen } = usePreview();
  const text = copy[kind];
  const next = safeDestination(params.get("continuar"));
  const suffix = params.has("continuar")
    ? `?continuar=${encodeURIComponent(next)}`
    : "";
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    if (
      (kind === "register" || kind === "password") &&
      fields.get("password") !== fields.get("confirm")
    ) {
      setError(true);
      setNotice("Las contraseñas no coinciden. Revisa ambos campos.");
      return;
    }
    if (kind === "register" && String(fields.get("name")).trim().length < 2) {
      setError(true);
      setNotice(
        "El nombre debe tener al menos 2 caracteres, sin contar los espacios externos.",
      );
      return;
    }
    setError(false);
    setNotice(
      kind === "recover"
        ? "Solicitud de ejemplo validada. No se envió ningún correo; la recuperación real estará disponible al conectar las cuentas."
        : kind === "password"
          ? "Contraseña de ejemplo validada. No se modificó ninguna cuenta."
          : kind === "register"
            ? "Formulario validado. No se creó una cuenta ni se envió un correo. Puedes recorrer el diseño con la cuenta de ejemplo."
            : "Formulario validado. Esta vista no comprueba credenciales ni inicia una sesión real. Usa la cuenta de ejemplo para recorrer tu espacio.",
    );
    for (const name of ["password", "confirm"]) {
      const input = event.currentTarget.elements.namedItem(name);
      if (input instanceof HTMLInputElement) input.value = "";
    }
  }
  return (
    <div className="container auth-layout">
      <aside className="auth-story">
        <p className="eyebrow">DE MANO EN MANO</p>
        <h2>
          Algo para ti.
          <br />
          Una oportunidad
          <br />
          <em>para alguien más.</em>
        </h2>
        <div className="auth-illustration" aria-hidden="true">
          <Icon name="bag" size={105} />
          <span>
            Un nuevo lugar
            <br />
            para conectar ↗
          </span>
        </div>
        <p>
          Productos nuevos y usados.
          <br />
          Personas que están más cerca de lo que crees.
        </p>
      </aside>
      <section className="auth-panel">
        <p className="eyebrow">BIENVENIDO A TRADENET</p>
        <h1>{text.title}</h1>
        <p className="page-description">{text.intro}</p>
        <p className="demo-form-note">
          Vista previa del formulario. Usa datos ficticios; todavía no se crean
          cuentas ni se envían correos.
        </p>
        <form className="stack-form" onSubmit={submit}>
          {kind === "register" && (
            <div className="field">
              <label htmlFor="auth-name">Nombre visible</label>
              <input
                id="auth-name"
                name="name"
                required
                minLength={2}
                maxLength={60}
                autoComplete="off"
                placeholder="Cómo te verá la comunidad"
              />
            </div>
          )}
          {kind !== "password" && (
            <div className="field">
              <label htmlFor="auth-email">Correo electrónico</label>
              <input
                id="auth-email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="off"
                placeholder="ejemplo@example.com"
              />
            </div>
          )}
          {kind !== "recover" && (
            <>
              <div className="field">
                <label htmlFor="auth-password">
                  {kind === "password" ? "Nueva contraseña" : "Contraseña"}
                </label>
                <div className="password-field">
                  <input
                    id="auth-password"
                    name="password"
                    type={visible ? "text" : "password"}
                    required
                    minLength={8}
                    maxLength={128}
                    autoComplete="off"
                    aria-describedby="password-hint"
                  />
                  <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    aria-pressed={visible}
                  >
                    {visible ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                <small id="password-hint">
                  Usa al menos 8 caracteres ficticios para probar el formulario.
                </small>
              </div>
              {(kind === "register" || kind === "password") && (
                <div className="field">
                  <label htmlFor="auth-confirm">Repetir contraseña</label>
                  <input
                    id="auth-confirm"
                    name="confirm"
                    type={visible ? "text" : "password"}
                    required
                    minLength={8}
                    maxLength={128}
                    autoComplete="off"
                  />
                </div>
              )}
            </>
          )}
          {kind === "login" && (
            <Link className="text-link auth-recovery" to="/recuperar-acceso">
              Olvidé mi contraseña
            </Link>
          )}
          {notice && <Notice error={error}>{notice}</Notice>}
          <button className="button button-dark full-width" type="submit">
            {text.button}
            <Icon name="arrow" size={18} />
          </button>
        </form>
        <div className="auth-links">
          {kind === "login" ? (
            <p>
              ¿Primera vez aquí?{" "}
              <Link to={`/registro${suffix}`}>Crear una cuenta</Link>
            </p>
          ) : (
            <Link to={`/ingresar${suffix}`}>Volver a ingresar</Link>
          )}
        </div>
        <div className="demo-entry">
          <span>¿Quieres recorrer el diseño?</span>
          <button
            className="button button-outline full-width"
            onClick={() => {
              setAccountOpen(true);
              navigate(next);
            }}
          >
            Abrir cuenta de ejemplo
          </button>
        </div>
      </section>
    </div>
  );
}
