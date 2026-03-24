import { useState } from "react";
import { _sampleProducts } from "../data";

export default function ProductsSection({ products = _sampleProducts }) {
  const [active, setActive] = useState(0);
  const selected = products[active];

  return (
    <div className="flex items-center" style={{ backgroundColor: "#1c1c1e" }}>
      <div className="w-full fade-in">
        <div className="">
          <h1 className="text-xl sm:text-[2rem] mt-15 text-white font-semibold">
            Our Products
          </h1>
          <p
            className="mono text-[10px] tracking-[0.2em] uppercase mb-6"
            style={{ color: "#d4b483" }}
          >
            {products.length} products
          </p>
        </div>

        {/* ── Main card ── */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "#242424",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {/* Featured image */}
          <div className="relative overflow-hidden" style={{ height: "360px" }}>
            <img
              key={selected.id}
              src={selected.img_url}
              alt={selected.product_name}
              className="w-full h-full object-cover fade-in"
            />
            {/* gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, #242424 0%, rgba(36,36,36,0.4) 50%, transparent 100%)",
              }}
            />

            {/* Name overlay */}
            <div className="absolute bottom-5 left-5 right-5">
              <h3
                className="display text-[2.2rem] leading-none text-white mb-2"
                style={{ letterSpacing: "0.02em" }}
              >
                {selected.product_name}
              </h3>
              <p className="text-[13px] leading-relaxed text-white/70">
                {selected.description}
              </p>
            </div>
          </div>

          {/* ── Thumbnails ── */}
          <div
            className="grid grid-cols-3 gap-3 p-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {products.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                className="thumb-hover flex-1 relative rounded-3xl overflow-hidden transition-all duration-200 py-6"
                style={{
                  background:
                    i === active ? "#d4b483" : "rgba(255,255,255,0.07)",
                  opacity: i === active ? 1 : 0.55,
                }}
              >
                {/* <img
                  src={p.img_url}
                  alt={p.product_name}
                  className="w-full h-full object-cover"
                /> */}

                <span
                  className="text-center text-sm uppercase font-semibold flex items-center justify-center "
                  style={{ color: i === active ? "#1c1c1c" : "#aaa" }}
                >
                  {p.product_name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
