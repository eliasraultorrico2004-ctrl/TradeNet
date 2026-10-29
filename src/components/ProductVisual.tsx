import type { Product, Visual } from "../data/demo";

const palette: Record<Visual, string> = {
  headphones: "#e7e8df",
  camera: "#ede4d8",
  chair: "#dfe8da",
  bike: "#e5e9ec",
  jacket: "#f0e2d9",
  books: "#e7e3ec",
  plant: "#e6eadb",
  desk: "#ece4d8",
  box: "#e5eadf",
};

export function ProductVisual({
  product,
  photo,
  variant = 0,
}: {
  product: Product;
  photo?: string;
  variant?: number;
}) {
  if (photo ?? product.photos[0])
    return (
      <img
        className="product-photo"
        src={photo ?? product.photos[0]}
        alt={product.title}
      />
    );
  return (
    <div
      className={`product-visual visual-${product.visual}`}
      style={{ backgroundColor: palette[product.visual] }}
    >
      <svg
        viewBox="0 0 320 240"
        role="img"
        aria-label={`Ilustración de ejemplo: ${product.title}`}
      >
        <ellipse
          cx="160"
          cy="203"
          rx="91"
          ry="10"
          fill="#243b2b"
          opacity=".08"
        />
        <g transform={variant ? "translate(320 0) scale(-1 1)" : undefined}>
          {product.visual === "headphones" && (
            <g stroke="#344139" strokeWidth="13" fill="none">
              <path d="M93 145V103a67 67 0 0 1 134 0v42" />
              <path
                d="M109 70a56 56 0 0 1 102 0"
                stroke="#758174"
                strokeWidth="8"
              />
              <rect
                x="82"
                y="116"
                width="40"
                height="76"
                rx="17"
                fill="#3b4c41"
              />
              <rect
                x="198"
                y="116"
                width="40"
                height="76"
                rx="17"
                fill="#3b4c41"
              />
              <path d="M110 130v48m99-48v48" stroke="#879883" strokeWidth="5" />
            </g>
          )}
          {product.visual === "camera" && (
            <g>
              <path d="M116 75l10-22h66l12 22" fill="#596154" />
              <rect
                x="58"
                y="74"
                width="204"
                height="122"
                rx="18"
                fill="#39473d"
              />
              <path d="M58 98h204v57H58Z" fill="#65745f" />
              <circle
                cx="165"
                cy="133"
                r="53"
                fill="#26372f"
                stroke="#a0aa94"
                strokeWidth="6"
              />
              <circle
                cx="165"
                cy="133"
                r="35"
                fill="#516963"
                stroke="#131f1b"
                strokeWidth="10"
              />
              <circle cx="156" cy="123" r="11" fill="#8da29c" opacity=".6" />
              <rect
                x="222"
                y="87"
                width="23"
                height="12"
                rx="3"
                fill="#d6ddbf"
              />
            </g>
          )}
          {product.visual === "chair" && (
            <g>
              <path
                d="m104 177-9 32m117-32 8 32"
                stroke="#8f7051"
                strokeWidth="10"
              />
              <rect
                x="92"
                y="50"
                width="139"
                height="121"
                rx="32"
                fill="#718364"
              />
              <rect
                x="79"
                y="133"
                width="161"
                height="59"
                rx="19"
                fill="#829473"
              />
              <rect
                x="75"
                y="111"
                width="30"
                height="73"
                rx="13"
                fill="#65795b"
              />
              <rect
                x="214"
                y="111"
                width="30"
                height="73"
                rx="13"
                fill="#65795b"
              />
              <path d="M119 76v58m83-58v58" stroke="#9ead8f" strokeWidth="2" />
            </g>
          )}
          {product.visual === "bike" && (
            <g strokeLinecap="round" strokeLinejoin="round" fill="none">
              <circle
                cx="83"
                cy="163"
                r="45"
                stroke="#3d4942"
                strokeWidth="8"
              />
              <circle
                cx="244"
                cy="163"
                r="45"
                stroke="#3d4942"
                strokeWidth="8"
              />
              <path
                d="m83 163 50-69 41 69H83l37-87m54 87 48-69m-89 0h89l22 69"
                stroke="#a97750"
                strokeWidth="8"
              />
              <path
                d="M106 74h28m82-3h20l-14 23m-48 69 14 15m-20 0h27"
                stroke="#3d4942"
                strokeWidth="7"
              />
            </g>
          )}
          {product.visual === "jacket" && (
            <g>
              <path
                d="m126 49-24 13-43 72 34 19 22-34-6 88h104l-6-88 22 34 34-19-43-72-24-13-36 13Z"
                fill="#b47758"
              />
              <path d="m126 49 34 26 36-26-13-12h-44Z" fill="#e6c3a4" />
              <path
                d="M160 75v132m-37-58h25m24 0h25"
                stroke="#78513f"
                strokeWidth="3"
              />
              <path d="m126 49 16 38 18-12 20 12 16-38" fill="#935e45" />
            </g>
          )}
          {product.visual === "books" && (
            <g>
              <g transform="rotate(-7 160 175)">
                <rect
                  x="64"
                  y="153"
                  width="192"
                  height="41"
                  rx="5"
                  fill="#647760"
                />
                <path d="M82 161h173v24H82" fill="#f2e9d5" />
                <path d="M97 165h150m-150 7h150m-150 7h150" stroke="#d7cdb9" />
              </g>
              <g transform="rotate(5 160 135)">
                <rect
                  x="75"
                  y="112"
                  width="171"
                  height="37"
                  rx="5"
                  fill="#b07c58"
                />
                <path d="M91 119h153v22H91" fill="#f8eedf" />
              </g>
              <rect
                x="87"
                y="76"
                width="150"
                height="34"
                rx="5"
                fill="#8d83a0"
              />
              <path d="M101 82h134v21H101" fill="#eee8de" />
            </g>
          )}
          {product.visual === "plant" && (
            <g>
              <path
                d="M160 161V70m0 54-44-40m44 26 42-44"
                stroke="#667b4c"
                strokeWidth="6"
                fill="none"
              />
              <path
                d="M158 103C103 108 85 57 103 48c38-1 57 23 55 55m4 26c51-2 78-46 55-59-38 4-54 22-55 59m-2-52c-31-9-28-54-6-55 28 17 23 40 6 55"
                fill="#82975b"
              />
              <path d="M117 153h88l-13 57h-63Z" fill="#bd8c69" />
              <rect
                x="110"
                y="143"
                width="102"
                height="20"
                rx="5"
                fill="#c99b77"
              />
            </g>
          )}
          {product.visual === "desk" && (
            <g>
              <path
                d="M82 113v96m157-96v96"
                stroke="#927655"
                strokeWidth="11"
              />
              <rect
                x="63"
                y="104"
                width="194"
                height="16"
                rx="4"
                fill="#c7ab83"
              />
              <path d="M78 123h166v37H78Z" fill="#d7bd97" />
              <path
                d="M160 123v37m-63-18h22m75 0h22"
                stroke="#927655"
                strokeWidth="3"
              />
              <rect
                x="131"
                y="59"
                width="58"
                height="43"
                rx="3"
                fill="#667b68"
              />
              <path d="M139 67h42v28h-42Z" fill="#bdd0ba" />
            </g>
          )}
          {product.visual === "box" && (
            <g
              fill="#b8c6a4"
              stroke="#667b55"
              strokeWidth="4"
              strokeLinejoin="round"
            >
              <path d="m160 59 80 39v87l-80 38-80-38V98Z" />
              <path
                d="m80 98 80 40 80-40m-80 40v85M120 79l80 39v34"
                fill="none"
              />
            </g>
          )}
        </g>
      </svg>
      <span className="visual-caption">ILUSTRACIÓN · EJEMPLO</span>
    </div>
  );
}
