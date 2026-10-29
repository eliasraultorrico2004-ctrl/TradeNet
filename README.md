# TradeNet

Marketplace web en español, desarrollado en este repositorio desde VS Code con React y Supabase.

## Estado del proyecto

La **fase 3: interfaz del marketplace** completa las pantallas sobre React, TypeScript, Vite y React Router. Incluye una demostración interactiva con datos ficticios. Todavía no hay conexión con Supabase.

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

La base funciona sin credenciales. `.env.example` documenta las variables públicas previstas para Supabase en la fase 4; no es necesario completarlas todavía. Los archivos `.env` se excluyen de Git y nunca deben contener claves secretas con prefijo `VITE_`, porque ese prefijo expone valores al navegador.

## Comprobaciones

```powershell
npm run typecheck
npm run build
npm run preview
```

`build` comprueba los tipos y genera `dist/`. `preview` permite revisar esa compilación localmente. Al alojar la aplicación, el servidor debe redirigir las rutas de la aplicación hacia `index.html`, para que funcionen al abrir enlaces directos o recargar.

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

El menú «Mi espacio» permite recorrer las pantallas de ejemplo. En ingreso y registro, «Abrir cuenta de ejemplo» muestra la navegación de la cuenta sin simular una autenticación real. La vista de moderación también es pública para revisión: no constituye control de acceso. Las sesiones, los permisos y la persistencia se implementarán con Supabase en las fases correspondientes.

Los detalles de las entregas están en [fase 2](docs/fase-2-base.md) y [fase 3](docs/fase-3-interfaz.md). La siguiente fase es preparar los datos, archivos y permisos de Supabase.
