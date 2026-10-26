# Fase 2 — Base de TradeNet

## Entrega

- Aplicación React web con TypeScript y Vite, en el repositorio existente.
- React Router para todas las rutas propuestas en la fase 1, incluidas las rutas con identificadores y la página 404.
- Componentes compartidos, páginas, configuración del mercado y estilos separados.
- Inicio con categorías y un catálogo sin productos de ejemplo, para no confundir datos ficticios con publicaciones reales.
- Búsqueda y selección de categoría reflejadas en la URL. Estas acciones todavía no consultan una base de datos.
- Configuración del mercado: Bolivia, bolivianos (BOB), símbolo Bs y categorías para productos nuevos y usados.
- Diseño base adaptable, etiquetas de formularios, foco visible, enlace para saltar al contenido y preferencias de movimiento reducido.
- Scripts para desarrollo, comprobación de tipos, compilación y vista previa.
- Plantilla de variables de entorno y exclusión de credenciales, dependencias y archivos generados de Git.

## Límites de esta fase

Las rutas de ingreso, registro, perfiles, producto, publicación, favoritos, mensajes y moderación son espacios reservados. No hay inicio de sesión simulado, productos guardados, formularios que aparenten publicar ni privilegios administrativos funcionales.

Las páginas se pueden visitar para revisar la navegación; el control de acceso se añadirá junto con las sesiones y los permisos de Supabase. El catálogo muestra su estado inicial vacío. Los filtros completos de ciudad, condición y precio corresponden a la fase 6.

Los colores y la composición son una propuesta inicial para poder revisar la base. La fase 3 completará las pantallas y definirá la identidad visual. Las fuentes web tienen alternativas locales para que la aplicación siga siendo legible sin acceso a Google Fonts.

## Requisito de Node

Se recomienda Node.js 24 LTS; el mínimo del proyecto es Node.js 22.22 y se requiere npm 11 o superior. La terminal original del entorno tenía Node.js 22.9 y npm 10.8.3; este último falló al resolver dependencias. La instalación y compilación se verifican con el runtime 24 disponible en Codex y npm 11 temporal. No se modifica la instalación global de Node ni de npm.

## Verificación de la entrega

- Instalación completa con archivo `package-lock.json`; la auditoría de instalación informó cero vulnerabilidades.
- Comprobación estricta de tipos y compilación de producción completadas.
- Servidor local con respuesta HTTP 200.
- Navegación comprobada en navegador: inicio, catálogo, las 14 rutas reservadas y la página 404.
- Búsqueda con eliminación de espacios externos, combinación con categoría, persistencia al recargar y limpieza de filtros.
- Revisión visual en pantalla de celular y computadora, sin desbordamiento horizontal en las dimensiones comprobadas.
- Sin errores ni advertencias de consola durante las comprobaciones de navegación.

## Próximo paso

Fase 3: completar las interfaces y los estados de las pantallas definidas. Fase 4: crear el modelo de datos y las políticas en Supabase. No se han creado recursos remotos ni publicado la web.
