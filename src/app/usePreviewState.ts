import { useState } from "react";

import {
  initialProducts,
  initialConversations,
  initialReports,
  profiles,
  myId,
} from "../data/demo";
import type { Product, ProductStatus, Profile, Report } from "../data/demo";
import { isAvailable, isVisible } from "../lib/catalog";

// Only fictional, in-memory data: replace this layer with Supabase in later phases.
export function usePreviewState() {
  const [products, setProducts] = useState(initialProducts);
  const [profile, setProfile] = useState<Profile>(profiles[0]);
  const [favorites, setFavorites] = useState(["camara", "sillon"]);
  const [conversations, setConversations] = useState(initialConversations);
  const [reports, setReports] = useState(initialReports);
  const [accountOpen, setAccountOpen] = useState(false);
  function toggleFavorite(id: string) {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  }
  function saveProduct(
    draft: Omit<Product, "id" | "sellerId" | "createdAt">,
    id?: string,
  ) {
    const existing = products.find((item) => item.id === id);
    if (id && (!existing || existing.sellerId !== myId || existing.deleted))
      return null;
    const product: Product = existing
      ? { ...existing, ...draft, hidden: existing.hidden }
      : {
          ...draft,
          id: crypto.randomUUID(),
          sellerId: myId,
          createdAt: new Date().toISOString(),
        };
    setProducts((previous) =>
      existing
        ? previous.map((item) => (item.id === id ? product : item))
        : [product, ...previous],
    );
    return product.id;
  }
  function changeStatus(id: string, status: ProductStatus) {
    setProducts((previous) =>
      previous.map((item) =>
        item.id === id &&
        item.sellerId === myId &&
        !item.hidden &&
        !item.deleted
          ? { ...item, status }
          : item,
      ),
    );
  }
  function deleteProduct(id: string) {
    setProducts((previous) =>
      previous.map((item) =>
        item.id === id && item.sellerId === myId
          ? { ...item, deleted: true }
          : item,
      ),
    );
  }
  function startConversation(productId: string) {
    const product = products.find((item) => item.id === productId);
    if (!product || !isAvailable(product) || product.sellerId === myId)
      return null;
    const existing = conversations.find(
      (item) => item.productId === productId && item.buyerId === myId,
    );
    if (existing) return existing.id;
    const id = crypto.randomUUID();
    setConversations((previous) => [
      ...previous,
      {
        id,
        productId,
        buyerId: myId,
        sellerId: product.sellerId,
        messages: [],
      },
    ]);
    return id;
  }
  function sendMessage(id: string, text: string) {
    if (!text.trim() || text.trim().length > 2000) return;
    setConversations((previous) =>
      previous.map((item) =>
        item.id === id && [item.buyerId, item.sellerId].includes(myId)
          ? {
              ...item,
              messages: [
                ...item.messages,
                {
                  id: crypto.randomUUID(),
                  senderId: myId,
                  text: text.trim(),
                  time: new Intl.DateTimeFormat("es-BO", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date()),
                },
              ],
            }
          : item,
      ),
    );
  }
  function reportProduct(productId: string, reason: string, detail: string) {
    const product = products.find((item) => item.id === productId);
    if (!product || product.sellerId === myId || !isAvailable(product))
      return false;
    if (
      reports.some(
        (item) =>
          item.productId === productId &&
          item.reporterId === myId &&
          item.status === "pendiente",
      )
    )
      return false;
    setReports((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        productId,
        reason,
        detail: detail.trim(),
        reporterId: myId,
        status: "pendiente",
      },
    ]);
    return true;
  }
  function resolveReport(id: string, status: Report["status"]) {
    const report = reports.find((item) => item.id === id);
    if (!report || status === "pendiente") return;
    setReports((previous) =>
      previous.map((item) =>
        item.productId === report.productId && item.status === "pendiente"
          ? { ...item, status }
          : item,
      ),
    );
    if (status === "oculto")
      setProducts((previous) =>
        previous.map((item) =>
          item.id === report.productId
            ? { ...item, hidden: true, moderationReason: report.reason }
            : item,
        ),
      );
  }
  function restoreProduct(id: string) {
    setProducts((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, hidden: false, moderationReason: undefined }
          : item,
      ),
    );
  }
  function getProfile(id: string) {
    return id === myId ? profile : profiles.find((item) => item.id === id);
  }
  return {
    products,
    profile,
    setProfile,
    favorites,
    toggleFavorite,
    conversations,
    reports,
    accountOpen,
    setAccountOpen,
    saveProduct,
    changeStatus,
    deleteProduct,
    startConversation,
    sendMessage,
    reportProduct,
    resolveReport,
    restoreProduct,
    getProfile,
    availableProducts: products.filter(isAvailable),
    ownProducts: products.filter(
      (item) => item.sellerId === myId && !item.deleted,
    ),
    visibleProducts: products.filter(isVisible),
  };
}
export type PreviewState = ReturnType<typeof usePreviewState>;
