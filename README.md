# TradeNet

Marketplace web en español, desarrollado en este repositorio desde VS Code con React y Supabase.

## Estado del proyecto

La **fase 4: infraestructura de Supabase** ya está aplicada y verificada en el proyecto remoto: tablas, RLS, almacenamiento privado y cliente tipado. La interfaz de la fase 3 sigue funcionando como demostración local hasta conectar las cuentas y las operaciones en las siguientes fases.

La primera versión permitirá explorar productos físicos nuevos y usados, crear una cuenta, publicar artículos y conversar con vendedores para acordar una compra. El lanzamiento será en **Bolivia**, con precios en **bolivianos (BOB)**.

El alcance, las pantallas, los datos y los criterios de aceptación están en [docs/fase-1-alcance.md](docs/fase-1-alcance.md).

## Fases de desarrollo

1. Definir la primera versión y sus recorridos.
2. Preparar React, TypeScript, Vite y la navegación.
3. Construir la interfaz adaptable a computadora y celular.
4. Configurar datos, imágenes y permisos en Supabase.
5. Implementar cuentas y perfiles.
6. Conectar publicaciones, catálogo y búsqueda.
7. Añadir favoritos y mensajería.
8. Verificar los recorridos, incorporar moderación básica y publicar.

El documento de alcance registra las decisiones confirmadas y las propuestas pendientes para las siguientes fases.

## Desarrollo local

Requisitos: **Node.js 24 LTS recomendado y npm 11 o superior**, o Node.js 22.22 o superior compatible con las dependencias. La versión 22.9 no alcanza el mínimo. Si usas nvm, `.nvmrc` indica la versión recomendada.

Desde la carpeta del proyecto:

```powershell
npm install
npm run dev
```

Abrir la dirección que muestra Vite: normalmente `http://127.0.0.1:5173`. Ese puerto se mantiene fijo; si está ocupado, se debe liberar antes de iniciar. Para detener el servidor, pulsa `Ctrl+C` en su terminal.

La demostración funciona sin credenciales. Para usar el cliente real, `.env.example` documenta `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`; los valores de este entorno están en `.env.local`, excluido de Git. Los archivos `.env` nunca deben contener claves secretas con prefijo `VITE_`, porque ese prefijo expone valores al navegador. No se usa `EXPO_PUBLIC_` en esta aplicación web.

## Comprobaciones

```powershell
npm run typecheck
npm run build
npm run preview
npm run test:db
npm run test:config
npm run supabase:check
```

`build` comprueba los tipos y genera `dist/`. `preview` permite revisar esa compilación localmente. Al alojar la aplicación, el servidor debe redirigir las rutas de la aplicación hacia `index.html`, para que funcionen al abrir enlaces directos o recargar.

`test:db` comprueba las migraciones y permisos en PostgreSQL en memoria, sin tocar el proyecto remoto. `test:config` valida la configuración pública. `supabase:check` necesita acceso a Internet y comprueba la API real sin escribir datos; no imprime claves.

## Estructura

```text
src/
  app/          Rutas y estado temporal de la demostración
  components/   Navegación, productos, formularios y estados compartidos
  config/       Mercado boliviano y categorías iniciales
  data/         Productos, perfiles y conversaciones ficticios
  lib/          Filtros, importes, imágenes y destinos internos
  pages/        Pantallas del marketplace y del espacio personal
  styles/       Estilos compartidos y adaptación a celular
public/         Recursos estáticos
supabase/       Migraciones aplicadas y contratos de pruebas SQL
scripts/        Comprobaciones de base de datos, configuración y conexión
docs/           Alcance y registro de las fases
```

## Qué funciona en esta fase

- Navegación por todas las rutas de la fase 1 y página para direcciones desconocidas.
- Inicio, catálogo, detalle y galería de productos adaptables a celular y computadora, con ilustraciones propias de ejemplo.
- Búsqueda sin distinguir tildes ni mayúsculas, filtros por categoría, ciudad, condición y precio, y ordenamiento. Los parámetros se conservan en la URL; se aplican a los datos ficticios.
- Formularios de ingreso, registro y recuperación, con validación y avisos claros de que no operan sobre cuentas reales.
- Perfil público y edición de nombre e imagen de la cuenta de ejemplo.
- Creación y edición de publicaciones locales con fotos y vista previa, pausa, reactivación, venta y eliminación con confirmación.
- Favoritos, bandeja de conversaciones y envío de mensajes locales de ejemplo.
- Vista de moderación con reportes ficticios, ocultamiento y restauración de publicaciones.
- Selector de estados de carga, vacío y error en las pantallas con contenido, para revisar el diseño.
- Configuración centralizada para Bolivia, BOB y productos nuevos y usados.

**Los datos y las operaciones de esta fase son de demostración.** No se guardan en una base de datos ni en el almacenamiento del navegador. Los cambios, fotos elegidas y mensajes se pierden al recargar o cerrar la página. Los formularios de cuentas no envían correos, no validan credenciales ni crean cuentas; usa datos ficticios para revisarlos.

El menú «Mi espacio» permite recorrer las pantallas de ejemplo. En ingreso y registro, «Abrir cuenta de ejemplo» muestra la navegación de la cuenta sin simular una autenticación real. La vista de moderación también es pública para revisión: no constituye control de acceso. Los permisos del backend real ya están preparados; las sesiones y las operaciones de la interfaz se conectarán en las fases correspondientes.

Los detalles de las entregas están en [fase 2](docs/fase-2-base.md), [fase 3](docs/fase-3-interfaz.md) y [fase 4](docs/fase-4-supabase.md). La siguiente fase es conectar las cuentas y perfiles reales a Supabase.
