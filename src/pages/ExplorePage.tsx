import { Link, useSearchParams } from "react-router";
import { categories } from "../config/market";
import { Icon } from "../components/Icon";
import { SearchForm } from "../components/SearchForm";

export function ExplorePage() {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";
  const category = categories.find(
    (item) => item.id === params.get("categoria"),
  );

  return (
    <div className="container inner-page">
      <p className="eyebrow">EL MARKETPLACE DE BOLIVIA</p>
      <h1>Explora las posibilidades.</h1>
      <p className="page-description">
        Productos nuevos y usados, con precios en bolivianos.
      </p>
      <SearchForm
        className="catalog-search"
        key={`${query}:${category?.id ?? ""}`}
      >
        <div className="field">
          <label htmlFor="catalog-query">Buscar productos</label>
          <input
            id="catalog-query"
            type="search"
            name="q"
            defaultValue={query}
            maxLength={100}
            placeholder="¿Qué estás buscando?"
          />
        </div>
        <div className="field">
          <label htmlFor="catalog-category">Categoría</label>
          <select
            id="catalog-category"
            name="categoria"
            defaultValue={category?.id ?? ""}
          >
            <option value="">Todas las categorías</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <button className="button button-dark" type="submit">
          <Icon name="search" size={18} /> Buscar
        </button>
      </SearchForm>
      <div className="catalog-summary">
        <span>
          {category?.name ?? "Todas las categorías"}
          {query && <> · «{query}»</>}
        </span>
        {(query || params.has("categoria")) && (
          <Link className="text-link" to="/explorar">
            Limpiar filtros
          </Link>
        )}
      </div>
      <div className="empty-state">
        <span className="empty-icon">
          <Icon name="box" size={36} />
        </span>
        <h2>Los primeros hallazgos están por llegar</h2>
        <p>
          Pronto podrás descubrir aquí los productos de la comunidad TradeNet.
        </p>
        <Link className="text-link" to="/">
          Volver al inicio <Icon name="arrow" size={18} />
        </Link>
      </div>
    </div>
  );
}
