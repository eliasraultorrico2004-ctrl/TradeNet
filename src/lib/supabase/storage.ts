import { getSupabase } from "./client";

export const storageBuckets = {
  products: "product-images",
  avatars: "avatars",
} as const;
const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function uploadProductImage(
  productId: string,
  file: File,
  position: number,
) {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      productId,
    )
  )
    throw new Error("Identificador de publicación inválido.");
  if (!Number.isInteger(position) || position < 0 || position > 4)
    throw new Error("La posición de la foto debe estar entre 0 y 4.");
  if (!extensions[file.type] || file.size === 0 || file.size > 5 * 1024 * 1024)
    throw new Error("Usa una imagen JPEG, PNG o WebP de hasta 5 MB.");
  const client = getSupabase();
  const identity = await client.auth.getUser();
  if (identity.error || !identity.data.user)
    throw new Error("Inicia sesión antes de subir una foto.");
  const path = `${identity.data.user.id}/${productId}/${crypto.randomUUID()}.${extensions[file.type]}`;
  const uploaded = await client.storage
    .from(storageBuckets.products)
    .upload(path, file, {
      contentType: file.type,
      cacheControl: "60",
      upsert: false,
    });
  if (uploaded.error) throw uploaded.error;
  const image = await client
    .from("product_images")
    .insert({ product_id: productId, storage_path: path, position })
    .select()
    .single();
  if (image.error) {
    const cleanup = await client.storage
      .from(storageBuckets.products)
      .remove([path]);
    if (cleanup.error)
      throw new Error(
        "No se pudo vincular la foto. Quedó un archivo propio pendiente de limpieza en Storage.",
      );
    throw image.error;
  }
  return image.data;
}

export async function createAssetUrl(
  bucket: (typeof storageBuckets)[keyof typeof storageBuckets],
  path: string,
) {
  // A previously issued URL remains usable for up to 60 seconds after visibility changes.
  const result = await getSupabase()
    .storage.from(bucket)
    .createSignedUrl(path, 60);
  if (result.error) throw result.error;
  return result.data.signedUrl;
}
