export type SupabaseConfiguration =
  | { status: "ready"; url: string; publishableKey: string }
  | { status: "missing" | "invalid"; message: string };

export function readSupabaseConfiguration(input: {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}): SupabaseConfiguration {
  const url = input.VITE_SUPABASE_URL?.trim() ?? "";
  const publishableKey = input.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ?? "";
  if (!url && !publishableKey)
    return {
      status: "missing",
      message:
        "Supabase no está configurado. Completa .env.local usando .env.example.",
    };
  if (!url || !publishableKey)
    return {
      status: "invalid",
      message: "Configura la URL y la clave publicable de Supabase juntas.",
    };
  try {
    const parsed = new URL(url);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
    if (
      (parsed.protocol !== "https:" &&
        !(local && parsed.protocol === "http:")) ||
      parsed.username ||
      parsed.password ||
      parsed.pathname !== "/" ||
      parsed.search ||
      parsed.hash
    )
      throw new Error();
  } catch {
    return {
      status: "invalid",
      message:
        "La URL de Supabase debe ser una dirección HTTPS válida, sin credenciales ni rutas adicionales.",
    };
  }
  if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(publishableKey))
    return {
      status: "invalid",
      message:
        "Usa una clave sb_publishable_. Nunca pongas una clave secret o service_role en el frontend.",
    };
  return { status: "ready", url: url.replace(/\/$/, ""), publishableKey };
}
