import { Link } from "react-router";
import { categories } from "../config/market";
import { Icon } from "../components/Icon";
import { SearchForm } from "../components/SearchForm";
import { usePreview } from "../app/usePreview";
import { ProductCard } from "../components/ProductCard";
import { DataState } from "../components/Ui";

export function HomePage() {
  const { availableProducts } = usePreview();
  return (
    <div className="container home-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> CONECTAMOS BOLIVIA
          </p>
          <h1>
            Eso que buscas.
            <br />
            Eso que <em>ya tienes.</em>
          </h1>
          <p className="hero-description">
            Encuentra algo para ti o dale una nueva historia a lo que ya no
            usas. Compra y vende cerca de ti.
          </p>
          <SearchForm className="search-form">
            <Icon name="search" />
            <label className="sr-only" htmlFor="home-search">
              Buscar productos
            </label>
            <input
              id="home-search"
              name="q"
              type="search"
              maxLength={100}
              placeholder="¿Qué estás buscando?"
            />
            <button className="button button-dark" type="submit">
              Buscar <Icon name="arrow" size={18} />
            </button>
          </SearchForm>
          <p className="hero-caption">
            Productos nuevos y usados <span>·</span> Precios en bolivianos
          </p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <span className="art-note">
            ALGO BUENO
            <br />
            ESTÁ POR PASAR.
          </span>
          <div className="art-card art-card-back">
            <Icon name="bag" size={76} />
            <span>Una nueva oportunidad</span>
          </div>
          <div className="art-card art-card-front">
            <div className="art-label">NUEVAS HISTORIAS</div>
            <Icon name="box" size={94} />
            <span>
              Lo tuyo puede ser
              <br />
              <strong>el próximo hallazgo.</strong>
            </span>
          </div>
          <span className="art-sticker">
            De mano
            <br />
            en mano ↗
          </span>
        </div>
      </section>
      <section
        className="categories-section"
        aria-labelledby="categories-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">POR DÓNDE EMPEZAR</p>
            <h2 id="categories-heading">Encuentra tu próximo hallazgo</h2>
          </div>
          <Link className="text-link" to="/explorar">
            Explorar todo <Icon name="arrow" size={18} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              className="category-card"
              to={`/explorar?categoria=${category.id}`}
              key={category.id}
            >
              <span className="category-icon">
                <Icon name={category.icon} size={27} />
              </span>
              <span>{category.name}</span>
              <Icon name="arrow" size={17} />
            </Link>
          ))}
        </div>
      </section>
      <section className="recent-section" aria-labelledby="recent-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">NUEVAS OPORTUNIDADES</p>
            <h2 id="recent-heading">Recién llegados a TradeNet</h2>
          </div>
          <Link className="text-link" to="/explorar">
            Ver todos <Icon name="arrow" size={18} />
          </Link>
        </div>
        <DataState>
          <div className="product-grid">
            {availableProducts.slice(0, 4).map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </DataState>
        <p className="section-footnote">
          Selección ilustrativa con precios y productos de ejemplo.
        </p>
      </section>
      <section className="start-banner">
        <div>
          <p className="eyebrow">DALE OTRA VUELTA</p>
          <h2>¿Ya no lo usas? Alguien lo está buscando.</h2>
          <p>Haz espacio para lo que viene y conecta con un nuevo comprador.</p>
        </div>
        <Link className="button button-dark" to="/publicar">
          Publicar un producto <Icon name="plus" size={19} />
        </Link>
      </section>
    </div>
  );
}
