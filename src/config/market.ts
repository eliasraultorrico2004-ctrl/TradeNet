export const market = {
  name: "TradeNet",
  country: "Bolivia",
  countryCode: "BO",
  currency: "BOB",
  currencySymbol: "Bs",
  locale: "es-BO",
} as const;

export const categories = [
  { id: "tecnologia", name: "Tecnología", icon: "screen" },
  { id: "hogar", name: "Hogar y muebles", icon: "home" },
  { id: "moda", name: "Moda y accesorios", icon: "bag" },
  { id: "deportes", name: "Deportes y aire libre", icon: "sun" },
  { id: "entretenimiento", name: "Libros y entretenimiento", icon: "book" },
  { id: "otros", name: "Otros", icon: "grid" },
] as const;
