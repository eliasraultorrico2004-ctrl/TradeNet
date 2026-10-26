# TradeNet

Marketplace web en español, desarrollado en este repositorio desde VS Code con React y Supabase.

## Estado del proyecto

La **fase 2: base del proyecto** incorpora React, TypeScript, Vite y React Router. El `index.html` ahora carga la aplicación React. Todavía no hay conexión con Supabase.

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
  app/          Rutas y composición de la aplicación
  components/   Navegación, iconos y formulario de búsqueda
  config/       Mercado boliviano y categorías iniciales
  pages/        Inicio, explorar y páginas pendientes
  styles/       Estilos compartidos y adaptación a celular
public/         Recursos estáticos
docs/           Alcance y registro de las fases
```

## Qué funciona en esta fase

- Navegación por todas las rutas de la fase 1 y página para direcciones desconocidas.
- Inicio y catálogo base adaptables a celular y computadora.
- Búsqueda y categoría conservadas en la URL, con opción de limpiar filtros. El catálogo todavía no consulta productos.
- Configuración centralizada para Bolivia, BOB y productos nuevos y usados.

Las pantallas de cuentas, productos, publicaciones, favoritos, mensajes y moderación muestran avisos de próxima disponibilidad. No realizan operaciones ni ofrecen acceso a datos privados. Las sesiones, la protección real de rutas, los permisos y la persistencia se implementarán con Supabase en las fases correspondientes.

El detalle de esta entrega está en [docs/fase-2-base.md](docs/fase-2-base.md).
