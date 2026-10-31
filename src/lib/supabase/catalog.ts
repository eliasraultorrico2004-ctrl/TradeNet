import { getSupabase } from "./client";

// Separate from demo fixtures: consumers opt into real data in the subsequent phases.
export async function loadReferenceData() {
  const client = getSupabase();
  const [categories, cities] = await Promise.all([
    client.from("categories").select("id,name,sort_order").order("sort_order"),
    client.from("cities").select("id,name,country_code").order("name"),
  ]);
  if (categories.error) throw categories.error;
  if (cities.error) throw cities.error;
  return { categories: categories.data, cities: cities.data };
}

export async function loadPublicProducts(page = 1) {
  if (!Number.isInteger(page) || page < 1)
    throw new Error("La página debe ser un entero positivo.");
  const offset = (page - 1) * 20;
  const result = await getSupabase()
    .from("products")
    .select("*,product_images(id,storage_path,position)", { count: "exact" })
    .eq("status", "activa")
    .is("hidden_at", null)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .order("id")
    .range(offset, offset + 19);
  if (result.error) throw result.error;
  return {
    products: result.data.map((product) => ({
      ...product,
      product_images: [...product.product_images].sort(
        (a, b) => a.position - b.position,
      ),
    })),
    count: result.count ?? 0,
  };
}
