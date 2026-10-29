import { NavLink } from "react-router";
import type { ReactNode } from "react";
import { usePreview } from "../app/usePreview";
import { Avatar } from "./Ui";

export function AccountLayout({ children }: { children: ReactNode }) {
  const { profile } = usePreview();
  return (
    <div className="container account-layout">
      <aside className="account-sidebar">
        <div className="account-identity">
          <Avatar name={profile.name} src={profile.avatar} />
          <div>
            <strong>{profile.name}</strong>
            <span>Tu cuenta de ejemplo</span>
          </div>
        </div>
        <nav aria-label="Espacio personal">
          <NavLink to="/mi-perfil">Mi perfil</NavLink>
          <NavLink to="/mis-publicaciones">Mis publicaciones</NavLink>
          <NavLink to="/favoritos">Favoritos</NavLink>
          <NavLink to="/mensajes">Mensajes</NavLink>
        </nav>
        <div className="sidebar-tip">
          <strong>Dale una nueva historia.</strong>
          <p>Lo que ya no usas puede ser justo lo que alguien busca.</p>
          <NavLink className="text-link" to="/publicar">
            Publicar un producto ↗
          </NavLink>
        </div>
      </aside>
      <div className="account-content">{children}</div>
    </div>
  );
}
