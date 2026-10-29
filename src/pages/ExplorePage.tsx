import { Link, useSearchParams } from "react-router";
import { categories } from "../config/market";
import { cities } from "../data/demo";
import { usePreview } from "../app/usePreview";
import { filterProducts } from "../lib/catalog";
import { Icon } from "../components/Icon";
import { SearchForm } from "../components/SearchForm";
import { ProductCard } from "../components/ProductCard";
import { DataState, EmptyState, PageHeading } from "../components/Ui";

export function ExplorePage() {
  const [params, setParams] = useSearchParams();
  const { products } = usePreview();
  const results = filterProducts(products, params);
  const pageSize = 20;
  const pageCount = Math.max(1, Math.ceil(results.length / pageSize));
  const rawPage = Number(params.get("pagina") ?? 1);
  const page = Math.min(
    pageCount,
    Math.max(1, Number.isFinite(rawPage) ? Math.floor(rawPage) : 1),
  );
  const hasFilters = [
    "q",
    "categoria",
    "ciudad",
    "condicion",
    "min",
    "max",
  ].some((key) => params.get(key));
  function changePage(value: number) {
    const next = new URLSearchParams(params);
    next.set("pagina", String(value));
    setParams(next);
    window.scrollTo(0, 0);
  }
  return (
    <div className="container inner-page">
      <PageHeading
        eyebrow="EL MARKETPLACE DE BOLIVIA"
        title="Tu próximo hallazgo está aquí."
        description="Explora productos nuevos y usados, de mano en mano."
      />
      <SearchForm
        className="catalog-search catalog-search-expanded"
        key={params.toString()}
      >
        <div className="field field-search">
          <label htmlFor="catalog-query">¿Qué estás buscando?</label>
          <input
            id="catalog-query"
            type="search"
            name="q"
            defaultValue={params.get("q") ?? ""}
            maxLength={100}
            placeholder="Una bicicleta, un libro, algo para ti…"
          />
        </div>
        <div className="field">
          <label htmlFor="catalog-category">Categoría</label>
          <select
            id="catalog-category"
            name="categoria"
            defaultValue={params.get("categoria") ?? ""}
          >
            <option value="">Todas</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="catalog-city">Ciudad</label>
          <select
            id="catalog-city"
            name="ciudad"
            defaultValue={params.get("ciudad") ?? ""}
          >
            <option value="">Toda Bolivia</option>
            {cities.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="catalog-condition">Condición</label>
          <select
            id="catalog-condition"
            name="condicion"
            defaultValue={params.get("condicion") ?? ""}
          >
            <option value="">Nuevo y usado</option>
            <option>Nuevo</option>
            <option>Usado</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="catalog-min">Desde (Bs)</label>
          <input
            id="catalog-min"
            name="min"
            type="number"
            min="0"
            step="0.01"
            defaultValue={params.get("min") ?? ""}
            placeholder="0"
          />
        </div>
        <div className="field">
          <label htmlFor="catalog-max">Hasta (Bs)</label>
          <input
            id="catalog-max"
            name="max"
            type="number"
            min="0"
            step="0.01"
            defaultValue={params.get("max") ?? ""}
            placeholder="Sin máximo"
          />
        </div>
        <input
          type="hidden"
          name="orden"
          value={params.get("orden") ?? "recientes"}
        />
        <button className="button button-dark" type="submit">
          <Icon name="search" size={18} /> Buscar
        </button>
      </SearchForm>
      <div className="catalog-toolbar">
        <p>
          <strong>{results.length}</strong>{" "}
          {results.length === 1
            ? "producto de ejemplo"
            : "productos de ejemplo"}
          {params.get("q") && <> para «{params.get("q")}»</>}
        </p>
        <div>
          {hasFilters && (
            <Link className="text-link" to="/explorar">
              Limpiar filtros
            </Link>
          )}
          <label className="sort-control">
            <span>Ordenar por</span>
            <select
              aria-label="Ordenar productos"
              value={params.get("orden") ?? "recientes"}
              onChange={(event) => {
                const next = new URLSearchParams(params);
                next.set("orden", event.target.value);
                next.delete("pagina");
                setParams(next);
              }}
            >
              <option value="recientes">Más recientes</option>
              <option value="precio-asc">Menor precio</option>
              <option value="precio-desc">Mayor precio</option>
            </select>
          </label>
        </div>
      </div>
      <DataState
        emptyTitle="El catálogo está por empezar"
        emptyDescription="Aquí aparecerán las publicaciones de la comunidad."
      >
        {results.length ? (
          <div className="product-grid">
            {results
              .slice((page - 1) * pageSize, page * pageSize)
              .map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
          </div>
        ) : (
          <EmptyState
            title="Todavía no encontramos ese hallazgo"
            description="Prueba otras palabras o amplía tus filtros para descubrir más productos."
            action={
              <Link className="button button-dark" to="/explorar">
                Ver todos los productos
              </Link>
            }
          />
        )}
      </DataState>
      {pageCount > 1 && (
        <nav className="pagination" aria-label="Páginas del catálogo">
          <button
            className="button button-outline"
            disabled={page <= 1}
            onClick={() => changePage(page - 1)}
          >
            Anterior
          </button>
          <span>
            Página {page} de {pageCount}
          </span>
          <button
            className="button button-outline"
            disabled={page >= pageCount}
            onClick={() => changePage(page + 1)}
          >
            Siguiente
          </button>
        </nav>
      )}
    </div>
  );
}
