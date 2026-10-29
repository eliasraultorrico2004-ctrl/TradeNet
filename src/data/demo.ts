export type ProductStatus = "activa" | "pausada" | "vendida";
export type Visual =
  | "headphones"
  | "camera"
  | "chair"
  | "bike"
  | "jacket"
  | "books"
  | "plant"
  | "desk"
  | "box";
export type Product = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  condition: "Nuevo" | "Usado";
  city: string;
  sellerId: string;
  status: ProductStatus;
  visual: Visual;
  photos: string[];
  createdAt: string;
  hidden?: boolean;
  moderationReason?: string;
  deleted?: boolean;
};
export type Profile = {
  id: string;
  name: string;
  avatar: string;
  joined: string;
};
export type Message = {
  id: string;
  senderId: string;
  text: string;
  time: string;
};
export type Conversation = {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  messages: Message[];
};
export type Report = {
  id: string;
  productId: string;
  reason: string;
  detail: string;
  status: "pendiente" | "descartado" | "oculto";
  reporterId: string;
};

export const myId = "mi-cuenta";
export const cities = [
  "La Paz",
  "El Alto",
  "Santa Cruz de la Sierra",
  "Cochabamba",
  "Sucre",
  "Oruro",
  "Potosí",
  "Tarija",
  "Trinidad",
  "Cobija",
];
export const reportReasons = [
  "Fraude o información engañosa",
  "Contenido inapropiado",
  "Artículo prohibido",
  "Otro",
];
export const profiles: Profile[] = [
  { id: myId, name: "Alex · Ejemplo", avatar: "", joined: "2026-10-01" },
  {
    id: "mariana",
    name: "Mariana · Ejemplo",
    avatar: "",
    joined: "2026-09-01",
  },
  { id: "diego", name: "Diego · Ejemplo", avatar: "", joined: "2026-08-01" },
];
export const initialProducts: Product[] = [
  {
    id: "audifonos",
    title: "Audífonos inalámbricos",
    description:
      "Audífonos de diadema con almohadillas suaves y estuche. Muy cuidados, ideales para escuchar música o trabajar. Incluye cable de carga. Podemos coordinar la entrega.",
    category: "tecnologia",
    price: 450,
    condition: "Usado",
    city: "La Paz",
    sellerId: myId,
    status: "activa",
    visual: "headphones",
    photos: [],
    createdAt: "2026-10-28T10:00:00",
  },
  {
    id: "camara",
    title: "Cámara para nuevas aventuras",
    description:
      "Cámara compacta para fotografía cotidiana. Se entrega con correa y batería. El equipo está en buen estado y puede revisarse al coordinar la compra.",
    category: "tecnologia",
    price: 1850,
    condition: "Usado",
    city: "Cochabamba",
    sellerId: "mariana",
    status: "activa",
    visual: "camera",
    photos: [],
    createdAt: "2026-10-28T09:00:00",
  },
  {
    id: "sillon",
    title: "Sillón de lectura verde",
    description:
      "Un rincón cómodo para leer o descansar. Sillón de una plaza con patas de madera, tapizado verde y sin roturas. Retiro a coordinar en la ciudad.",
    category: "hogar",
    price: 720,
    condition: "Usado",
    city: "Santa Cruz de la Sierra",
    sellerId: "diego",
    status: "activa",
    visual: "chair",
    photos: [],
    createdAt: "2026-10-27T18:00:00",
  },
  {
    id: "bicicleta",
    title: "Bicicleta urbana aro 26",
    description:
      "Bicicleta urbana para paseos y trayectos diarios. Frenos revisados y asiento regulable. Lista para usar. Puedes verla antes de decidir.",
    category: "deportes",
    price: 1250,
    condition: "Usado",
    city: "La Paz",
    sellerId: "mariana",
    status: "activa",
    visual: "bike",
    photos: [],
    createdAt: "2026-10-27T17:00:00",
  },
  {
    id: "chaqueta",
    title: "Chaqueta de media estación",
    description:
      "Chaqueta nueva, talla M, color terracota. Corte cómodo, bolsillos delanteros y cierre completo. Una opción práctica para el día a día.",
    category: "moda",
    price: 180,
    condition: "Nuevo",
    city: "Sucre",
    sellerId: "diego",
    status: "activa",
    visual: "jacket",
    photos: [],
    createdAt: "2026-10-27T16:00:00",
  },
  {
    id: "libros",
    title: "Un pequeño universo de libros",
    description:
      "Lote de tres libros de lectura general, vendidos juntos. Interiores completos y tapas cuidadas. Perfectos para sumar nuevas historias a tu biblioteca.",
    category: "entretenimiento",
    price: 90,
    condition: "Usado",
    city: "Tarija",
    sellerId: "mariana",
    status: "activa",
    visual: "books",
    photos: [],
    createdAt: "2026-10-27T15:00:00",
  },
  {
    id: "planta",
    title: "Planta de interior con maceta",
    description:
      "Planta de interior en maceta de cerámica. Se entrega con recomendaciones de cuidado. Para dar un toque verde a un espacio con luz indirecta.",
    category: "otros",
    price: 65,
    condition: "Nuevo",
    city: "Cochabamba",
    sellerId: "diego",
    status: "activa",
    visual: "plant",
    photos: [],
    createdAt: "2026-10-27T14:00:00",
  },
  {
    id: "escritorio",
    title: "Escritorio de madera clara",
    description:
      "Escritorio de líneas simples para estudiar o trabajar desde casa. Superficie amplia y estructura firme. Se retira armado; entrega a coordinar.",
    category: "hogar",
    price: 650,
    condition: "Usado",
    city: "La Paz",
    sellerId: myId,
    status: "pausada",
    visual: "desk",
    photos: [],
    createdAt: "2026-10-26T13:00:00",
  },
  {
    id: "libros-vendidos",
    title: "Colección de novelas",
    description:
      "Lote de novelas en buen estado. Esta publicación de ejemplo ya se vendió y se conserva para mostrar el estado de una venta terminada.",
    category: "entretenimiento",
    price: 120,
    condition: "Usado",
    city: "La Paz",
    sellerId: myId,
    status: "vendida",
    visual: "books",
    photos: [],
    createdAt: "2026-10-25T12:00:00",
  },
];
export const initialConversations: Conversation[] = [
  {
    id: "charla-bicicleta",
    productId: "bicicleta",
    buyerId: myId,
    sellerId: "mariana",
    messages: [
      {
        id: "m1",
        senderId: myId,
        text: "¡Hola! Me interesa la bicicleta. ¿Todavía está disponible?",
        time: "10:20",
      },
      {
        id: "m2",
        senderId: "mariana",
        text: "¡Hola! Sí, todavía la tengo. Podemos coordinar para que la veas.",
        time: "10:24",
      },
    ],
  },
  {
    id: "charla-audifonos",
    productId: "audifonos",
    buyerId: "diego",
    sellerId: myId,
    messages: [
      {
        id: "m3",
        senderId: "diego",
        text: "Hola, ¿los audífonos incluyen su estuche?",
        time: "09:15",
      },
    ],
  },
];
export const initialReports: Report[] = [
  {
    id: "reporte-ejemplo",
    productId: "chaqueta",
    reason: "Fraude o información engañosa",
    detail:
      "Reporte ficticio para revisar el diseño de moderación; no acusa a una persona real.",
    status: "pendiente",
    reporterId: "mariana",
  },
];
