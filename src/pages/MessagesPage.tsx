import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, NavLink, useParams } from "react-router";
import { usePreview } from "../app/usePreview";
import { myId } from "../data/demo";
import { isVisible, money } from "../lib/catalog";
import { Avatar, DataState, EmptyState, PageHeading } from "../components/Ui";
import { Icon } from "../components/Icon";

export function MessagesPage() {
  const { id } = useParams();
  const { conversations, products, getProfile, sendMessage } = usePreview();
  const [draft, setDraft] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const mine = conversations.filter((item) =>
    [item.buyerId, item.sellerId].includes(myId),
  );
  const selected = mine.find((item) => item.id === id);
  const product = products.find((item) => item.id === selected?.productId);
  const otherId = selected
    ? selected.buyerId === myId
      ? selected.sellerId
      : selected.buyerId
    : "";
  const other = getProfile(otherId);
  const displayProduct =
    product && isVisible(product) && product.status !== "pausada";
  useEffect(() => {
    setDraft("");
  }, [id]);
  useEffect(() => {
    if (messagesRef.current)
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [id, selected?.messages.length]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !draft.trim()) return;
    sendMessage(selected.id, draft);
    setDraft("");
  }
  return (
    <>
      <PageHeading
        title="Las buenas compras empiezan conversando."
        description="Pregunta, conoce los detalles y acuerda tu próximo hallazgo."
      />
      <DataState
        emptyTitle="Aquí empezará tu próxima conversación"
        emptyDescription="Abre un producto y contacta al vendedor para comenzar."
      >
        <div className={`inbox ${id ? "inbox-selected" : ""}`}>
          <nav className="conversation-list" aria-label="Conversaciones">
            <p className="eyebrow">TU BANDEJA · {mine.length}</p>
            {mine.map((conversation) => {
              const participant = getProfile(
                conversation.buyerId === myId
                  ? conversation.sellerId
                  : conversation.buyerId,
              )!;
              const item = products.find(
                (candidate) => candidate.id === conversation.productId,
              );
              const visible =
                item && isVisible(item) && item.status !== "pausada";
              return (
                <NavLink
                  to={`/mensajes/${conversation.id}`}
                  key={conversation.id}
                >
                  <Avatar name={participant.name} src={participant.avatar} />
                  <div>
                    <strong>{participant.name}</strong>
                    <span>
                      {visible ? item.title : "Publicación no disponible"}
                    </span>
                    <p>
                      {conversation.messages.at(-1)?.text ??
                        "Inicia una conversación"}
                    </p>
                  </div>
                </NavLink>
              );
            })}
            {!mine.length && (
              <p className="helper-text">Todavía no tienes conversaciones.</p>
            )}
          </nav>
          <section
            className="conversation-panel"
            aria-label="Conversación seleccionada"
          >
            {selected && other ? (
              <>
                <header className="conversation-heading">
                  <Link className="text-link mobile-back" to="/mensajes">
                    ← Bandeja
                  </Link>
                  <div className="seller-card">
                    <Avatar name={other.name} src={other.avatar} />
                    <div>
                      <strong>{other.name}</strong>
                      <span>Conversación de ejemplo</span>
                    </div>
                  </div>
                </header>
                <div className="conversation-product">
                  {displayProduct ? (
                    <Link to={`/productos/${product.id}`}>
                      <span>{product.title}</span>
                      <strong>
                        {money(product.price)} <Icon name="arrow" size={14} />
                      </strong>
                    </Link>
                  ) : (
                    <span>
                      Publicación no disponible · Historial conservado
                    </span>
                  )}
                </div>
                <div
                  className="message-history"
                  ref={messagesRef}
                  role="log"
                  aria-label="Historial de mensajes"
                  aria-live="polite"
                >
                  <p className="conversation-date">MENSAJES DE EJEMPLO</p>
                  {selected.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message-bubble ${message.senderId === myId ? "mine" : ""}`}
                    >
                      <p>{message.text}</p>
                      <time>{message.time}</time>
                    </div>
                  ))}
                  {!selected.messages.length && (
                    <p className="message-invitation">
                      Saluda y pregunta lo que necesitas saber sobre el
                      producto.
                    </p>
                  )}
                </div>
                <form className="message-composer" onSubmit={submit}>
                  <label className="sr-only" htmlFor="message-draft">
                    Escribe un mensaje
                  </label>
                  <textarea
                    id="message-draft"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    maxLength={2000}
                    rows={2}
                    placeholder="Escribe un mensaje de ejemplo…"
                    required
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey &&
                        !event.nativeEvent.isComposing
                      ) {
                        event.preventDefault();
                        if (draft.trim())
                          event.currentTarget.form?.requestSubmit();
                      }
                    }}
                  />
                  <div>
                    <span>{draft.length}/2.000 · Solo en esta vista</span>
                    <button
                      className="button button-dark button-small"
                      disabled={!draft.trim()}
                      type="submit"
                    >
                      Enviar <Icon name="arrow" size={16} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <EmptyState
                title={
                  id
                    ? "No encontramos esta conversación"
                    : "Cada hallazgo tiene una historia"
                }
                description={
                  id
                    ? "El enlace no corresponde a una conversación de tu cuenta de ejemplo."
                    : "Elige una conversación de tu bandeja o descubre un producto para comenzar."
                }
                action={
                  <Link className="text-link" to="/explorar">
                    Explorar productos <Icon name="arrow" size={16} />
                  </Link>
                }
              />
            )}
          </section>
        </div>
      </DataState>
    </>
  );
}
