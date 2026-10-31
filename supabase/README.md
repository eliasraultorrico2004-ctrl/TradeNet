# Base de datos de TradeNet

Las migraciones de `migrations/` están aplicadas al proyecto existente **Tradeweb**, referencia `fhjgkfgucnqgtiswxzfo`. Los prefijos de archivo coinciden con las versiones registradas en Supabase; son marcas de tiempo UTC.

1. `20261031021038_marketplace.sql`: tablas, restricciones, índices, permisos, políticas RLS y datos de referencia.
2. `20261031021047_storage.sql`: contenedores privados y acceso a archivos.
3. `20261031021157_api_functions.sql`: implementaciones privilegiadas en el esquema privado y funciones públicas sin elevación de privilegios.

Los archivos son el historial aplicado, no scripts para ejecutar repetidamente. Los próximos cambios deben añadirse en nuevas migraciones. No incluyen contraseñas, claves de administración ni cuentas o productos de demostración.

## Pruebas

```powershell
npm run test:db
npm run test:config
npm run supabase:check
```

`test:db` aplica las migraciones a PostgreSQL en memoria con PGlite. El archivo `tests/bootstrap.sql` simula los contratos mínimos de `auth.users`, `auth.uid()` y las tablas de Storage; **no se aplica al proyecto remoto**. Los roles y datos de prueba viven únicamente en esa base local y se descartan al finalizar.

`supabase:check` consulta el proyecto con la clave publicable de `.env.local`, sin crear cuentas ni datos. Con `npm run supabase:check -- --report` actualiza el informe de conexión en `docs/fase-4-verificacion.json`, sin guardar claves.

## Uso en las siguientes fases

- El registro de Auth crea el perfil mediante un trigger; el único dato de metadatos que se copia es `display_name`. El correo permanece en Auth.
- Crear una publicación produce un **borrador**. Después de cargar y vincular al menos una foto, el propietario puede cambiar su estado a `activa`. Los borradores no aparecen en el catálogo público.
- Las imágenes usan rutas `usuario_uuid/producto_uuid/archivo_uuid.ext`; los avatares, `usuario_uuid/archivo_uuid.ext`. Los nombres de archivo no contienen datos personales.
- Las fotos se ordenan por `position`, de 0 a 4. Usar `reorder_product_images` para cambiar varias posiciones en una sola transacción.
- Para retirar un producto se establece `deleted_at`; la cuenta cliente no tiene permiso de borrado físico. Las conversaciones conservan la referencia mínima al producto.
- Una conversación se crea enviando solo `product_id`. El servidor establece comprador, vendedor y título de referencia; los mensajes aceptan únicamente `conversation_id` y `body`.
- Una imagen se desvincula del registro antes de borrarla de Storage. No se puede borrar la última foto de una publicación activa o vendida, ni borrar de Storage un archivo que siga vinculado. Se puede limpiar después de pausar o eliminar lógicamente el artículo.
- Los archivos no se sobrescriben: cada nueva carga utiliza un UUID nuevo. La limpieza de cargas abandonadas se incorporará al ciclo completo de publicación y mantenimiento.
- No hay administradores iniciales. La asignación futura se hará mediante una operación administrativa sobre `tradenet_private.admins`, utilizando un UUID de usuario confirmado. Los campos del perfil y los metadatos de registro nunca conceden ese permiso.

La interfaz de demostración todavía no usa estas operaciones remotas: las fases 5 a 7 conectarán las cuentas, las publicaciones y los mensajes.
