export async function readImage(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Elige imágenes JPEG, PNG o WebP.");
  if (file.size > 5 * 1024 * 1024)
    throw new Error("Cada imagen debe pesar como máximo 5 MB.");
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () =>
      reject(new Error("No pudimos leer la imagen. Inténtalo de nuevo."));
    reader.readAsDataURL(file);
  });
  await new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () =>
      reject(new Error("El archivo no se pudo abrir como imagen."));
    image.src = source;
  });
  return source;
}
