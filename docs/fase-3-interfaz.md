# Fase 3 — Interfaz del marketplace

## Entrega

Las rutas reservadas de la fase 2 ahora tienen pantallas completas. Se mantiene el estilo verde, los fondos claros, la tipografía y la composición inicial de TradeNet. La implementación es local, en el repositorio existente.

| Área | Interfaz e interacción de ejemplo |
| --- | --- |
| Inicio y catálogo | Productos recientes, categorías, búsqueda, filtros por ciudad, condición y rango de precio, orden y estado sin resultados. Parámetros en la URL y paginación de 20 resultados cuando corresponda. |
| Detalle | Galería, precio en Bs, ciudad, condición, descripción, perfil del vendedor, favoritos, contacto y reporte. Los artículos vendidos deshabilitan nuevas conversaciones. |
| Cuentas | Ingreso, registro, recuperación y cambio de contraseña con validación, mostrar/ocultar contraseña y avisos de demostración. No se envían solicitudes de acceso ni correos. |
| Perfiles | Perfil público con publicaciones activas; edición del nombre visible y avatar de la cuenta de ejemplo. |
| Publicaciones | Crear y editar con vista previa, seleccionar hasta 5 fotos JPEG/PNG/WebP de hasta 5 MB, elegir portada y quitar fotos. Para probar sin archivos se permite una ilustración de ejemplo, identificada como tal. |
| Administración personal | Pestañas por estado, pausa, reactivación, confirmación de venta y eliminación; mensajes de resultado. |
| Favoritos | Guardar y quitar; presentación neutra cuando la publicación deja de estar disponible. |
| Mensajes | Bandeja, conversación asociada al producto y envío de texto local. En celular se alterna entre bandeja y conversación con un enlace de regreso. |
| Moderación | Reportes, estados, confirmación de revisión, ocultamiento y restauración. Se impide repetir reportes pendientes de la misma cuenta sobre un artículo. |
| Estados | Carga, vacío y error con reintento desde el selector de la franja de demostración; páginas de recurso inexistente o no disponible y 404. |

## Datos y límites

- Los productos, importes, personas y conversaciones iniciales son ficticios. Las ilustraciones son SVG creados como componentes del proyecto y no representan fotos de artículos reales.
- El mercado sigue siendo Bolivia y la moneda BOB. Se propone una lista inicial de ciudades en `src/data/demo.ts`; la fase 4 establecerá sus identificadores y datos iniciales en la base.
- Todas las operaciones viven en la memoria de React. Al recargar se restaura el estado inicial, incluidas las fotos y los mensajes. No se usa almacenamiento persistente del navegador para simular el backend.
- Las imágenes elegidas se leen y validan en el navegador para la vista previa; no se suben a ningún servicio. La validación de archivos del servidor se añadirá con Supabase Storage.
- Los formularios de acceso solo comprueban formato y coincidencia; nunca comparan contraseñas con usuarios ficticios. Las contraseñas no se guardan en el estado global y se vacían tras la validación satisfactoria.
- «Abrir cuenta de ejemplo» cambia la presentación de la navegación. No genera una sesión ni un permiso. Las rutas personales y administrativas contienen únicamente ejemplos públicos.
- Los botones de contacto y envío no contactan a una persona real y no generan respuestas automáticas de un vendedor.
- Se mantienen fuera de alcance los pagos, pedidos y envíos integrados. No se ha publicado el sitio ni creado un proyecto remoto.

## Organización y conexión futura

`src/data/demo.ts` concentra los tipos y los datos ficticios. `src/app/usePreviewState.ts` contiene las operaciones locales y `PreviewContext.tsx` proporciona el estado a las páginas mediante `usePreview.ts`. Esta separación permite sustituir la capa temporal al conectar Supabase y mantiene estable la actualización de componentes durante el desarrollo.

Los componentes de producto, galería, avisos, diálogos, perfiles y estados son compartidos. Los filtros e importes están en `src/lib/catalog.ts` y la lectura de imágenes en `src/lib/images.ts`.

La protección visual de una pantalla y las reglas de la demostración no sustituyen las políticas RLS ni los permisos de Storage. La fase 4 debe crearlos antes de introducir datos reales; las fases 5 a 7 conectarán las cuentas y las operaciones correspondientes.

## Accesibilidad y adaptación

- Etiquetas visibles en formularios, foco de teclado, enlace para saltar al contenido y traslado del foco al contenido al cambiar de pantalla.
- Diálogos nativos con nombre accesible, foco contenido y cierre con Escape o botón.
- Acciones de favorito con estado accesible, avisos de validación y resultado, y texto alternativo en imágenes.
- Diseño de escritorio y celular, navegación personal adaptable, galería y formulario de publicación reorganizados en pantallas pequeñas.
- Tipografía con alternativas locales y respeto de la preferencia de movimiento reducido.

## Verificación

Se comprobó la compilación de producción con la validación estricta de TypeScript. La revisión en navegador cubrió:

1. Búsqueda sin tildes ni distinción de mayúsculas, persistencia del enlace al recargar, rango de precio inválido y orden de menor a mayor precio.
2. Galería, cambio de favoritos y conservación de los cambios al navegar entre pantallas.
3. Edición de perfil y reflejo del nombre en el perfil público.
4. Rechazo de un archivo que no es imagen, una foto mayor de 5 MB y una publicación sin fotos ni ilustración de ejemplo; lectura de una imagen PNG válida.
5. Creación de una publicación, edición conservando su identificador, pausa, reactivación, venta, cancelación de eliminación y eliminación confirmada.
6. Ingreso y registro de ejemplo, rechazo de contraseñas distintas, aviso de validación sin creación real de cuenta y rechazo de un destino externo al abrir la cuenta de ejemplo.
7. Inicio de conversación desde un producto y envío local de un mensaje.
8. Creación de reporte, rechazo de duplicado y confirmación de ocultamiento en moderación.
9. Estados de carga, vacío, error y reintento.
10. Rutas principales, 404, producto y perfil inexistentes, y rechazo de edición de una publicación ajena en la demostración.

Se revisaron pantallas a 1280 px y 390 px; las rutas comprobadas a 390 px no mostraron desbordamiento horizontal. La navegación final se verificó sin errores de consola después de recargar los módulos reorganizados.

La paginación se implementa para el catálogo completo; el conjunto inicial de siete artículos activos cabe en una sola página. Las verificaciones de usuarios reales, persistencia, envío de correo, permisos y acceso directo a archivos corresponden a las fases con Supabase.
