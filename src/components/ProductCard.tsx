import { Link } from "react-router";
import type { Product } from "../data/demo";
import { usePreview } from "../app/usePreview";
import { money } from "../lib/catalog";
import { ProductVisual } from "./ProductVisual";
import { Icon } from "./Icon";

export function ProductCard({ product }: { product: Product }) {
  const { favorites, toggleFavorite } = usePreview();
  const saved = favorites.includes(product.id);
  return (
    <article className="product-card">
      <div className="product-media">
        <Link
          to={`/productos/${product.id}`}
          aria-label={`Ver ${product.title}`}
        >
          <ProductVisual product={product} />
        </Link>
        <span className="condition-tag">{product.condition}</span>
        <button
          className={`favorite-button ${saved ? "saved" : ""}`}
          aria-label={`${saved ? "Quitar de" : "Guardar en"} favoritos: ${product.title}`}
          aria-pressed={saved}
          onClick={() => toggleFavorite(product.id)}
        >
          <Icon name="heart" size={20} />
        </button>
      </div>
      <div className="product-card-body">
        <p className="product-price">{money(product.price)}</p>
        <h3>
          <Link to={`/productos/${product.id}`}>{product.title}</Link>
        </h3>
        <p className="product-location">
          <Icon name="pin" size={13} />
          {product.city}
        </p>
      </div>
    </article>
  );
}
