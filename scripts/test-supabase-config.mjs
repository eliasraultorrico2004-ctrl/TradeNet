import test from "node:test";
import assert from "node:assert/strict";
import { readSupabaseConfiguration } from "../src/lib/supabase/configuration.ts";

test("configuración ausente no convierte la demostración en una conexión real", () => {
  assert.equal(readSupabaseConfiguration({}).status, "missing");
});
test("solo claves publicables y direcciones sin credenciales llegan al navegador", () => {
  const url = "https://example.supabase.co";
  for (const key of [
    "sb_secret_example",
    "service_role",
    "eyJhbGciOiJIUzI1NiJ9",
  ])
    assert.equal(
      readSupabaseConfiguration({
        VITE_SUPABASE_URL: url,
        VITE_SUPABASE_PUBLISHABLE_KEY: key,
      }).status,
      "invalid",
    );
  for (const bad of [
    "http://example.supabase.co",
    "https://user:password@example.supabase.co",
    "https://example.supabase.co/rest/v1/",
    "https://example.supabase.co?token=example",
  ])
    assert.equal(
      readSupabaseConfiguration({
        VITE_SUPABASE_URL: bad,
        VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
      }).status,
      "invalid",
    );
  assert.equal(
    readSupabaseConfiguration({
      VITE_SUPABASE_URL: url,
      VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
    }).status,
    "ready",
  );
});
