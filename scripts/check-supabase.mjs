import { createClient } from "@supabase/supabase-js";
import { readFile, writeFile } from "node:fs/promises";
import { parseEnv } from "node:util";
import { readSupabaseConfiguration } from "../src/lib/supabase/configuration.ts";

let local = {};
try {
  local = parseEnv(
    await readFile(new URL("../.env.local", import.meta.url), "utf8"),
  );
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const configuration = readSupabaseConfiguration({ ...local, ...process.env });
if (configuration.status !== "ready") {
  console.error(configuration.message);
  process.exitCode = 1;
} else {
  try {
    const client = createClient(
      configuration.url,
      configuration.publishableKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );
    const settings = await fetch(`${configuration.url}/auth/v1/settings`, {
      headers: { apikey: configuration.publishableKey },
      signal: AbortSignal.timeout(15000),
    });
    if (!settings.ok) throw new Error(`Auth respondió HTTP ${settings.status}`);
    const [categories, cities, products, privateMessages, privateSchema] =
      await Promise.all([
        client
          .from("categories")
          .select("id,name,sort_order")
          .order("sort_order"),
        client.from("cities").select("id,name,country_code"),
        client
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("status", "activa")
          .is("deleted_at", null)
          .is("hidden_at", null),
        client.from("messages").select("id").limit(1),
        client
          .schema("tradenet_private")
          .from("admins")
          .select("user_id")
          .limit(1),
      ]);
    for (const result of [categories, cities, products])
      if (result.error)
        throw new Error(`${result.error.code}: ${result.error.message}`);
    if (categories.data.length !== 6 || cities.data.length !== 10)
      throw new Error(
        "La estructura inicial no coincide: revisa las migraciones.",
      );
    if (!privateMessages.error || privateMessages.error.code !== "42501")
      throw new Error(
        "El acceso anónimo a mensajes no fue rechazado como se esperaba.",
      );
    if (!privateSchema.error || privateSchema.error.code !== "PGRST106")
      throw new Error(
        "El esquema privado debe quedar fuera de la API pública.",
      );
    const report = {
      checkedAt: new Date().toISOString(),
      projectUrl: configuration.url,
      auth: "ok",
      categories: categories.data.length,
      cities: cities.data.length,
      activeProducts: products.count,
      anonymousMessages: "denied",
      privateSchema: "not-exposed",
      credentialsPrinted: false,
    };
    console.log(JSON.stringify(report, null, 2));
    if (process.argv.includes("--report"))
      await writeFile(
        new URL("../docs/fase-4-verificacion.json", import.meta.url),
        JSON.stringify(report, null, 2) + "\n",
      );
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "No se pudo comprobar Supabase.",
    );
    process.exitCode = 1;
  }
}
