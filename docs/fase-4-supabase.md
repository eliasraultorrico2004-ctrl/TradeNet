# Fase 4 — Datos, archivos y permisos en Supabase

## Resultado

La estructura está creada y verificada en el proyecto existente **Tradeweb**. La URL y la clave publicable proporcionadas funcionan. La configuración local usa `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`, porque la aplicación es React web con Vite. El prefijo `EXPO_PUBLIC_` pertenece a la configuración anterior proporcionada y no se utiliza en TradeNet.

`.env.local` contiene los valores reales y está excluido de Git. `.env.example` solo documenta las variables. Las claves publicables identifican el proyecto; el acceso efectivo se controla mediante permisos y RLS, siguiendo la [documentación de Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Estructura aplicada

| Tabla pública | Contenido y acceso |
| --- | --- |
| `profiles` | Nombre visible y avatar públicos. Cada usuario confirmado modifica sus propios campos permitidos. No contiene correos ni roles. |
| `categories` | Seis categorías iniciales, de lectura pública. |
| `cities` | Diez ciudades de Bolivia; lectura pública. |
| `products` | Publicaciones en BOB con propietario, categoría, ciudad, condición, precio y estados. Escritura solo del propietario confirmado. |
| `product_images` | Hasta cinco imágenes vinculadas por producto, con orden de portada. Acceso coherente con la visibilidad de la publicación. |
| `favorites` | Lista privada de cada usuario, sin duplicados. |
| `conversations` | Comprador y vendedor establecidos por el servidor. Solo los participantes pueden consultar la conversación. |
| `messages` | Texto de hasta 2.000 caracteres, remitente establecido por el servidor y acceso solo a participantes. El rol administrador no da acceso a mensajes ajenos. |
| `reports` | Reportes del propio usuario y de administradores. Un reporte pendiente por cuenta y publicación; resolución administrativa. |

Todas las tablas públicas tienen RLS. `tradenet_private.admins` y `tradenet_private.moderation_events` guardan las asignaciones administrativas y la auditoría; no están expuestas por la API y no permiten lectura o escritura directa desde las cuentas cliente.

Los índices cubren propietarios, relaciones, consulta del catálogo por fecha/precio, conversaciones, mensajes y cola de reportes. Los datos iniciales remotos son únicamente categorías y ciudades: no se crearon usuarios, productos ficticios ni administradores.

## Reglas verificadas

- La sesión debe corresponder a una cuenta con correo confirmado para crear o modificar contenido.
- No se puede cambiar el propietario, la moneda BOB, la fecha de creación ni las columnas de moderación desde el cliente.
- La publicación se crea como borrador y requiere una foto vinculada antes de activarse. Se permiten hasta cinco posiciones de imagen distintas.
- La publicación pausada, oculta o eliminada deja de ser pública. Una edición del propietario no revierte un ocultamiento administrativo.
- La venta finalizada no se reactiva; bloquea nuevas conversaciones y conserva las existentes.
- La retirada del producto es lógica, para preservar las conversaciones. El historial conserva un título mínimo registrado al iniciar la conversación.
- Los favoritos y reportes no se pueden crear repetidamente de forma idéntica. Los mensajes no permiten suplantar remitentes.
- Las operaciones administrativas comprueban un permiso almacenado fuera del perfil editable y dejan registro de auditoría.

## Archivos

Se crearon `product-images` y `avatars`, ambos **privados**, con límite de **5 MB** y tipos JPEG, PNG y WebP. Las políticas se aplican a `storage.objects`, de acuerdo con el [control de acceso de Storage](https://supabase.com/docs/guides/storage/security/access-control).

El propietario puede cargar sus propios archivos en la carpeta correspondiente. Los demás acceden únicamente a imágenes vinculadas a publicaciones visibles o avatares públicos. No hay acceso anónimo a fotos de productos pausados, ocultos o eliminados. Una URL pública del contenedor no evita estas restricciones.

El cliente preparado genera enlaces firmados de **60 segundos**. Un enlace ya emitido puede seguir funcionando hasta su vencimiento tras ocultar el producto; las nuevas solicitudes quedan restringidas. Los bytes ya descargados no se pueden retirar de un navegador. Esta diferencia entre consulta con permisos y [enlaces temporales de Storage](https://supabase.com/docs/guides/storage/serving/downloads) debe conservarse al conectar la galería real.

La carga y su registro son operaciones de servicios distintos. Si el registro falla, el cliente intenta retirar el archivo recién cargado. Los archivos abandonados o cuya limpieza falle necesitarán la limpieza del ciclo completo de publicación; todavía no hay una tarea programada de mantenimiento.

## Cliente y comprobaciones

- Cliente oficial de Supabase instalado y tipado con el esquema remoto en `src/lib/supabase/database.types.ts`.
- Configuración validada, cliente único, lectura de categorías/ciudades/catálogo y funciones de carga/enlaces de imágenes preparadas para las siguientes fases.
- Historial local de tres migraciones sincronizado con el remoto.
- Veinte grupos de comprobaciones de PostgreSQL pasaron en una base aislada con usuarios de prueba. Cubren propiedad, RLS, publicación con fotos, límite y orden de imágenes, privacidad, moderación, venta, borrado lógico y avatares.
- Dos pruebas de configuración comprobaron valores ausentes y rechazo de claves no publicables, URL sin HTTPS remoto y direcciones con credenciales o rutas adicionales.
- Conexión real con el SDK: Auth responde, se leen seis categorías y diez ciudades, el catálogo real empieza vacío, el acceso anónimo a mensajes se rechaza y el esquema administrativo no está expuesto.
- Validación de TypeScript y compilación de producción completadas.

El informe reproducible de conexión está en [fase-4-verificacion.json](fase-4-verificacion.json). Las pruebas locales validan SQL y políticas; no sustituyen las pruebas futuras de registro, confirmación de correo y carga de bytes mediante la API real de Storage con cuentas reales.

## Revisión del asesor de Supabase

Después de aplicar y revisar las funciones, el asesor no informó advertencias de seguridad. Conserva dos notas informativas [RLS Enabled No Policy](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy) para las tablas privadas de administradores y auditoría: es deliberado que no tengan políticas de acceso para clientes y que sus permisos de tabla estén revocados.

El asesor de rendimiento informa índices [todavía sin uso](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index), algo esperado con un catálogo nuevo y vacío. Se conservan para las consultas y relaciones previstas; su utilidad se revisará con carga real.

## Qué sigue siendo demostración

La interfaz mantiene los datos ficticios y las operaciones temporales de la fase 3. Añadir credenciales no cambia automáticamente su modo ni sube ejemplos a la base real. La fase 5 conectará registro, sesiones, recuperación y perfiles; la fase 6 conectará publicaciones y catálogo; la fase 7 conectará favoritos y conversaciones.
