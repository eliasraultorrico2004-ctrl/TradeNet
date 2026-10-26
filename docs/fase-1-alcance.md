# TradeNet — Alcance de la primera versión

Estado: alcance inicial con país, moneda y tipo de productos confirmados por el usuario. Las propuestas restantes y las decisiones de las siguientes fases están identificadas al final.

## 1. Objetivo

Permitir que una persona encuentre un producto, consulte su información y contacte al vendedor; y que el vendedor publique, administre y marque sus artículos como vendidos.

TradeNet será una aplicación web en español, utilizable desde computadora y celular. VS Code será el entorno de desarrollo. La primera versión debe funcionar con cuentas y datos reales.

## 2. Decisiones de partida

| Tema | Alcance propuesto |
| --- | --- |
| Plataforma | React web y Supabase, según lo solicitado. |
| Base de desarrollo | React + TypeScript + Vite, a preparar en la fase 2. |
| Modelo | Marketplace de publicaciones entre usuarios. |
| Cuentas | Una misma cuenta puede comprar y vender. No necesita cambiar de rol. |
| Productos | Productos físicos nuevos y usados, confirmado por el usuario. |
| Contacto | Mensajería privada dentro de TradeNet, asociada a una publicación. |
| Cierre de la venta | Comprador y vendedor acuerdan pago y entrega entre ellos. El vendedor marca el producto como vendido. |
| Moneda | Bolivianos (BOB), confirmado por el usuario. Se mostrará el símbolo Bs y no habrá conversiones. |
| Ubicación | Lanzamiento en Bolivia, confirmado por el usuario; cada producto indicará su ciudad. No se mostrará dirección exacta. |
| Precio | Obligatorio y mayor que cero. Sin subastas, intercambios ni múltiples variantes por publicación. |
| Cantidad | Una publicación representa un artículo o un lote vendido como unidad; sin inventario de varias unidades. |

## 3. Qué incluye y qué queda para después

**Primera versión:** catálogo público, búsqueda y filtros, detalle del producto, cuentas por correo y contraseña, recuperación de acceso, perfil básico, gestión de publicaciones y fotos, favoritos, mensajes y reportes con revisión administrativa básica.

**Etapas posteriores:** pagos dentro de TradeNet, carrito, pedidos, envíos integrados, comisiones, reseñas, verificación de identidad, tiendas profesionales, servicios, notificaciones por correo o push y aplicaciones móviles nativas.

No se necesita un carrito para el recorrido de esta primera versión: el contacto parte de cada publicación.

## 4. Usuarios y permisos

| Persona | Acciones permitidas |
| --- | --- |
| Visitante | Explorar, buscar, filtrar y ver productos activos y perfiles públicos. |
| Usuario con cuenta confirmada | Lo anterior, publicar y administrar sus artículos, guardar favoritos, conversar y reportar publicaciones. |
| Administrador | Revisar reportes y ocultar o restaurar publicaciones. El permiso se asigna de forma controlada; nadie puede otorgárselo desde su perfil. |

El correo y los mensajes son privados. El perfil público muestra únicamente nombre visible, avatar opcional, fecha de ingreso y publicaciones visibles. Para comprar o vender se usa la misma cuenta.

## 5. Pantallas y navegación

Las rutas son una propuesta para organizar la fase 2.

| Pantalla | Ruta propuesta | Contenido y acción principal |
| --- | --- | --- |
| Inicio | `/` | Buscador, categorías, publicaciones recientes y acceso a publicar. |
| Catálogo | `/explorar` | Resultados, filtros, orden y paginación. |
| Producto | `/productos/:id` | Fotos, título, precio, condición, ciudad, descripción y vendedor; contactar, guardar o reportar. |
| Registro | `/registro` | Nombre visible, correo, contraseña y confirmación de correo. |
| Ingreso | `/ingresar` | Acceso con correo y contraseña. |
| Recuperación | `/recuperar-acceso` y `/actualizar-contrasena` | Solicitar recuperación y establecer una nueva contraseña. |
| Perfil público | `/usuarios/:id` | Información pública del vendedor y artículos activos. |
| Mi perfil | `/mi-perfil` | Editar nombre visible y avatar. |
| Mis publicaciones | `/mis-publicaciones` | Ver artículos propios y editar, pausar, reactivar, marcar vendido o eliminar. |
| Publicar | `/publicar` | Crear una publicación con fotos. |
| Editar publicación | `/productos/:id/editar` | Modificar una publicación propia. |
| Favoritos | `/favoritos` | Consultar y quitar productos guardados. |
| Mensajes | `/mensajes` y `/mensajes/:id` | Lista de conversaciones e historial privado. |
| Moderación | `/admin/reportes` | Reportes pendientes y acciones sobre publicaciones. |

La navegación principal tendrá inicio, explorar y publicar; con sesión iniciada también ofrecerá mensajes y un menú de cuenta con perfil, favoritos, publicaciones y cierre de sesión. En celular se conservarán las mismas funciones.

Cada pantalla que consulta datos contempla carga, ausencia de resultados, error con posibilidad de reintentar y recurso inexistente o inaccesible. Las rutas desconocidas muestran una página de recurso no encontrado.

## 6. Recorridos principales

### Encontrar y consultar un producto

1. El visitante entra al inicio o al catálogo.
2. Busca y filtra; abre un producto.
3. Pulsa «Contactar vendedor». Si no tiene sesión, ingresa o se registra y vuelve al producto.
4. Envía un mensaje; el vendedor lo encuentra en su bandeja.
5. Ambos acuerdan los detalles de la operación. El vendedor marca el artículo como vendido cuando corresponda.

### Publicar y administrar un artículo

1. El usuario ingresa con una cuenta cuyo correo esté confirmado.
2. Completa los datos, añade fotos y publica.
3. El artículo aparece en el catálogo y en sus publicaciones.
4. Puede editarlo, pausarlo para retirarlo temporalmente, reactivarlo o marcarlo como vendido.
5. Puede eliminarlo con confirmación. Se retira de la vista pública, conservando las referencias necesarias para conversaciones y reportes existentes.

### Reportar y moderar

1. Un usuario reporta una publicación indicando un motivo y, opcionalmente, una explicación.
2. El administrador revisa el reporte y oculta la publicación o descarta el reporte.
3. El vendedor ve que el artículo está oculto y el motivo. Una edición no lo vuelve a publicar; solo el administrador puede restaurar su visibilidad.

## 7. Datos y reglas de una publicación

| Campo | Regla inicial |
| --- | --- |
| Título | Obligatorio; de 5 a 100 caracteres. |
| Descripción | Obligatoria; de 20 a 3.000 caracteres. |
| Categoría | Una categoría disponible. |
| Precio | Importe positivo en bolivianos (BOB), con hasta dos decimales. La interfaz mostrará Bs y los datos guardarán el código BOB. |
| Condición | Nuevo o usado; obligatoria para los productos físicos admitidos. |
| Ciudad | Obligatoria; selección desde una lista de ciudades de Bolivia que se definirá antes de cargar los datos iniciales. |
| Fotos | De 1 a 5; JPEG, PNG o WebP; máximo propuesto de 5 MB por archivo. La primera es la portada. |
| Vendedor | La cuenta que crea la publicación; no puede asignarse a otra persona. |
| Fechas | Creación y última modificación, registradas por el sistema. |

Categorías propuestas: tecnología, hogar y muebles, moda y accesorios, deportes y aire libre, libros y entretenimiento, y otros. No incluiremos subcategorías en la primera versión.

La publicación tiene estado **activa**, **pausada** o **vendida**. Además, se registran por separado su eliminación y su ocultamiento por moderación, para que un cambio de estado del vendedor no revierta una acción administrativa.

Solo aparecen en catálogo los artículos activos que no estén eliminados ni ocultos. Los vendidos muestran su estado al abrir un enlace existente y no admiten nuevas conversaciones. Los pausados, eliminados u ocultos dejan de mostrar el detalle público. Las conversaciones previas conservan una referencia mínima al artículo.

## 8. Búsqueda, favoritos y mensajes

- **Búsqueda:** por palabras en título y descripción; filtros por categoría, ciudad, condición y precio mínimo/máximo. Orden por más recientes, menor precio o mayor precio; páginas de 20 resultados. Los filtros se conservan en la URL para compartir la búsqueda.
- **Favoritos:** cada usuario puede guardar un artículo una sola vez y quitarlo. Si deja de estar disponible, se indica sin exponer información retirada de la vista pública.
- **Conversaciones:** una por comprador y publicación, con comprador y vendedor como únicos participantes. El vendedor no puede contactarse a sí mismo. Solo se inician sobre artículos activos y visibles.
- **Mensajes:** texto de 1 a 2.000 caracteres, fecha, remitente e historial. Sin archivos adjuntos, llamadas ni indicadores de escritura en esta versión. Las conversaciones previas siguen siendo consultables y permiten responder aunque el producto se haya vendido o retirado.
- **Reportes:** motivos iniciales de fraude o información engañosa, contenido inapropiado, artículo prohibido y otro. Un usuario no puede crear varios reportes pendientes sobre la misma publicación. Antes de abrir al público se debe definir el contenido permitido para el mercado elegido.

## 9. Modelo conceptual de datos

Esta es la base para el diseño de Supabase en la fase 4, todavía sin crear tablas ni recursos remotos.

| Entidad | Responsabilidad y relaciones |
| --- | --- |
| Cuenta | Identidad de acceso, correo y recuperación, gestionados mediante Supabase Auth. |
| Perfil | Nombre visible y avatar de una cuenta. Los privilegios administrativos se gestionan por separado de los campos editables del perfil. |
| Categoría | Clasificación de publicaciones. |
| Ciudad | Lista de ubicaciones permitidas para el país de lanzamiento. |
| Publicación | Pertenece a un vendedor, una categoría y una ciudad; guarda precio, moneda, condición, estado y visibilidad. |
| Imagen de publicación | Referencia a un archivo y su posición dentro de una publicación. |
| Favorito | Relaciona usuario y publicación, sin duplicados. |
| Conversación | Relaciona publicación, comprador y vendedor, sin duplicados por comprador y publicación. |
| Mensaje | Pertenece a una conversación y tiene un remitente participante. |
| Reporte | Vincula una publicación y el usuario que reporta; registra motivo, revisión y resolución administrativa. |

Los permisos se aplicarán a los datos y archivos, además de a las pantallas. Nadie podrá modificar publicaciones ajenas, consultar mensajes de terceros ni obtener permisos administrativos editando su perfil. El acceso directo a imágenes deberá respetar la decisión de retirar una publicación de la vista pública.

## 10. Criterios para aceptar la primera versión

- [ ] Un visitante explora y filtra productos sin crear una cuenta.
- [ ] Un usuario se registra, confirma su correo, inicia y cierra sesión y recupera su acceso.
- [ ] El ingreso conserva el destino al que intentaba acceder el usuario.
- [ ] Una cuenta publica un artículo con fotos y otra cuenta lo ve en el catálogo.
- [ ] Solo su propietario puede editarlo, pausarlo, reactivarlo, marcarlo vendido o eliminarlo.
- [ ] Un usuario guarda y elimina favoritos sin duplicados.
- [ ] Dos cuentas distintas conversan sobre un artículo y el historial persiste al recargar.
- [ ] Una tercera cuenta no puede consultar esa conversación, ni accediendo directamente a los datos.
- [ ] Los datos privados del usuario no aparecen en el perfil público.
- [ ] Los artículos vendidos o retirados dejan de aparecer en el catálogo y no admiten nuevas conversaciones.
- [ ] Un reporte llega a moderación y un artículo oculto no puede ser reactivado por su vendedor.
- [ ] Los permisos de datos y archivos se verifican también con sesión cerrada y con otra cuenta.
- [ ] Los formularios muestran validaciones comprensibles y no pierden los datos ante un error recuperable.
- [ ] Los recorridos principales funcionan con teclado y en pantallas de celular y computadora.

## 11. Decisiones confirmadas y pendientes

| Decisión | Estado | Cuándo se necesita |
| --- | --- | --- |
| País y moneda | Confirmados por el usuario: Bolivia y bolivianos (BOB). | Aplicar a ubicaciones, precios y datos de ejemplo. |
| Tipo de publicaciones | Confirmado por el usuario: productos físicos nuevos y usados. | Aplicar a campos, categorías y filtros. |
| Ciudades disponibles | Pendiente de definir la lista inicial de ciudades de Bolivia. | Antes de cargar los datos iniciales en la fase 4. |
| Pago y entrega | Se propone acuerdo entre las partes, sin procesamiento dentro de TradeNet. | Antes de cerrar el alcance de la primera versión. |
| Identidad visual | Nombre TradeNet confirmado; colores, tipografía y logotipo pendientes. | Fase 3. |
| Contenido permitido y condiciones de uso | Pendientes para el mercado seleccionado. | Antes de la apertura pública en la fase 8. |
| Dominio y alojamiento web | Pendientes. | Fase 8. |

El país, la moneda y el tipo de publicaciones ya están definidos para preparar la base de React. Se mantiene como propuesta inicial el acuerdo de pago y entrega entre las partes; si se incluyen pagos dentro de TradeNet, habrá que ajustar el alcance antes de implementar esas funciones.

## 12. Entrega de la fase 1 y siguiente paso

La fase 1 deja documentados el alcance inicial, la navegación, los recorridos, las reglas de datos y los criterios de aceptación, con lanzamiento en Bolivia, precios en BOB y productos físicos nuevos y usados. Las propuestas restantes y las decisiones de las siguientes fases se conservan en la sección anterior.

La fase 2 preparará la aplicación React en este repositorio, reemplazará el contenido de prueba de `index.html`, organizará las carpetas y dejará la navegación base funcionando. La interfaz completa y la conexión real a Supabase corresponden a las fases siguientes.
