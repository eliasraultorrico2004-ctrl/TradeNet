import type { Product } from "../data/demo";
import { market } from "../config/market";

export const isVisible = (product: Product) =>
  !product.hidden && !product.deleted;
export const isAvailable = (product: Product) =>
  isVisible(product) && product.status === "activa";
export const money = (price: number) =>
  `${market.currencySymbol} ${new Intl.NumberFormat(market.locale, { minimumFractionDigits: Number.isInteger(price) ? 0 : 2, maximumFractionDigits: 2 }).format(price)}`;
export const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
export function safeDestination(value: string | null) {
  // Only allow known internal route families; never forward credentials or external URLs.
  return value &&
    /^\/(?:publicar|mi-perfil|mis-publicaciones|favoritos|mensajes(?:\/[a-zA-Z0-9-]+)?|productos\/[a-zA-Z0-9-]+(?:\/editar)?)$/.test(
      value,
    )
    ? value
    : "/mi-perfil";
}
export function filterProducts(products: Product[], params: URLSearchParams) {
  const words = normalize(params.get("q") ?? "")
    .split(/\s+/)
    .filter(Boolean);
  const min = params.get("min");
  const max = params.get("max");
  return products
    .filter(
      (product) =>
        isAvailable(product) &&
        words.every((word) =>
          normalize(`${product.title} ${product.description}`).includes(word),
        ) &&
        (!params.get("categoria") ||
          product.category === params.get("categoria")) &&
        (!params.get("ciudad") || product.city === params.get("ciudad")) &&
        (!params.get("condicion") ||
          product.condition === params.get("condicion")) &&
        (!min || product.price >= Number(min)) &&
        (!max || product.price <= Number(max)),
    )
    .sort((a, b) =>
      params.get("orden") === "precio-asc"
        ? a.price - b.price
        : params.get("orden") === "precio-desc"
          ? b.price - a.price
          : b.createdAt.localeCompare(a.createdAt),
    );
}
