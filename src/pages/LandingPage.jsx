import { useState, useEffect, useRef } from "react";
import { HiLightningBolt } from "react-icons/hi";

const features = [
  {
    number: "01",
    title: "Tap. Display. Done.",
    body: "Hold your Abankese NFC tag to any phone. Your profile loads instantly — no app install, no login required.",
  },
  {
    number: "02",
    title: "Always current",
    body: "Your tag links to live data. Update your role or number once on the platform — every tap reflects it immediately.",
  },
  {
    number: "03",
    title: "Works everywhere",
    body: "Android, iOS, kiosks, door panels. If it reads NFC, it reads Axis.",
  },
  {
    number: "04",
    title: "Access controls",
    body: "Decide what's public per tap. Keep sensitive fields behind permission layers without touching the tag itself.",
  },
];

const stats = [
  { value: "25k+", label: "Tags deployed" },
  { value: "<0.3s", label: "Tap to profile" },
  { value: "99.9%", label: "Uptime" },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeUp({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// NFC tap animation
function NFCIcon() {
  return (
    <div className="relative flex items-center justify-center w-10 h-10">
      <div
        className="absolute w-10 h-10 rounded-full border border-[#d4b483]/20 animate-ping"
        style={{ animationDuration: "2s" }}
      />
      <div
        className="absolute w-7 h-7 rounded-full border border-[#d4b483]/30 animate-ping"
        style={{ animationDuration: "2s", animationDelay: "0.3s" }}
      />
      <div
        className="relative w-5 h-5 rounded-full flex items-center justify-center"
        style={{ background: "#d4b483" }}
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
          <path
            d="M8 3C5.24 3 3 5.24 3 8s2.24 5 5 5 5-2.24 5-5"
            stroke="#1c1c1e"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M8 5.5C6.62 5.5 5.5 6.62 5.5 8S6.62 10.5 8 10.5"
            stroke="#1c1c1e"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="8" cy="8" r="1" fill="#1c1c1e" />
        </svg>
      </div>
    </div>
  );
}

export default function AbankeseLanding() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#1c1c1e", color: "#e8e0d4" }}
    >
      {/* ── Nav ────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
        style={{
          backgroundColor: "rgba(28,28,30,0.85)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Wordmark */}
          <div className="flex items-center gap-3">
            <div className="flex gap-2 text-white items-center font-medium">
              <HiLightningBolt size={15} className="text-[#d4b483]" />
              <p>
                Abankese <span className="font-light text-[#d4b483]">Axis</span>
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["How it works", "Platform", "Pricing"].map((l) => (
              <a key={l} href="#" className="nav-link text-sm">
                {l}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="#" className="nav-link text-sm">
              Sign in
            </a>
            <a
              href="#"
              className="btn-accent text-xs tracking-wide px-4 py-2 rounded-lg"
            >
              Order tags
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-8 h-8 flex flex-col justify-center gap-1.25"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-px transition-all duration-200"
                style={{
                  background: "#888",
                  transform: menuOpen
                    ? i === 0
                      ? "rotate(45deg) translateY(6px)"
                      : i === 1
                        ? "scaleX(0)"
                        : "rotate(-45deg) translateY(-6px)"
                    : "none",
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>

        {menuOpen && (
          <div
            className="md:hidden px-6 py-4 flex flex-col gap-4"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "#242424",
            }}
          >
            {["How it works", "Platform", "Pricing", "Sign in"].map((l) => (
              <a key={l} href="#" className="text-sm" style={{ color: "#888" }}>
                {l}
              </a>
            ))}
            <a
              href="#"
              className="btn-accent text-xs tracking-wide px-4 py-2.5 rounded-lg font-semibold text-center mt-1"
            >
              Order tags
            </a>
          </div>
        )}
      </nav>

      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative pt-36 pb-24 px-6 max-w-5xl mx-auto">
        {/* background glow */}
        <div
          className="absolute top-20 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(212,180,131,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-2xl">
          <div className="h1 flex items-center gap-3 mb-6">
            <NFCIcon />
            <span
              className="mono text-[11px] tracking-[0.2em] uppercase"
              style={{ color: "#d4b483" }}
            >
              NFC-powered employee profiles
            </span>
          </div>

          <h1
            className="h2 display text-[4rem] sm:text-[6rem] leading-[0.9] mb-8"
            style={{ color: "#e8e0d4", letterSpacing: "0.02em" }}
          >
            One tap.
            <br />
            <span
              style={{
                color: "#d4b483",
              }}
            >
              Your entire
            </span>
            <br />
            identity.
          </h1>

          <p
            className="h3 text-[15px] leading-relaxed max-w-md mb-10"
            style={{ color: "#888" }}
          >
            Abankese Axis links custom NFC tags to a live employee platform. Tap
            your tag, share your profile — no app, no friction, no outdated
            business cards.
          </p>

          <div className="h4 flex flex-wrap items-center gap-3">
            <a
              href="#"
              className="btn-accent px-6 py-3 rounded-xl text-sm tracking-wide"
            >
              Order your tags
            </a>
            <a
              href="#"
              className="btn-ghost px-6 py-3 rounded-xl text-sm font-medium tracking-wide"
            >
              See the platform
            </a>
          </div>
        </div>

        {/* Social proof */}
        <FadeUp delay={150} className="mt-16 flex items-center gap-4">
          <div className="avatar-frame flex -space-x-2.5">
            {[47, 38, 11, 44, 53].map((n) => (
              <img
                key={n}
                src={`https://i.pravatar.cc/48?img=${n}`}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
              />
            ))}
          </div>
          <p className="text-xs" style={{ color: "#666060" }}>
            <span className="font-semibold" style={{ color: "#e8e0d4" }}>
              2,400+
            </span>{" "}
            employees already on Axis
          </p>
        </FadeUp>
      </section>

      {/* ── Stats ────────────────────────────────── */}
      <FadeUp>
        <div className="divider border-y py-10 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-3 divide-x divide-white/[0.06]">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 px-4"
              >
                <span
                  className="display text-[2.4rem] sm:text-[3rem] leading-none"
                  style={{ color: "#e8e0d4", letterSpacing: "0.02em" }}
                >
                  {value}
                </span>
                <span
                  className="text-[10px] tracking-widest uppercase"
                  style={{ color: "#666060" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── How it works ─────────────────────────── */}
      <section className="py-28 px-6 max-w-5xl mx-auto">
        <FadeUp className="mb-16">
          <p
            className="mono text-[11px] tracking-[0.2em] uppercase mb-3"
            style={{ color: "#d4b483" }}
          >
            How it works
          </p>
          <h2
            className="display text-[3rem] sm:text-[4.2rem] leading-none max-w-lg"
            style={{ color: "#e8e0d4", letterSpacing: "0.02em" }}
          >
            Physical tag.
            <br />
            <span style={{ color: "#888" }}>Living profile.</span>
          </h2>
        </FadeUp>

        <div className="grid sm:grid-cols-2 gap-0">
          {features.map(({ number, title, body }, i) => (
            <FadeUp key={number} delay={i * 70}>
              <div className="feature-card pt-8 pb-10 pr-10">
                <span
                  className="feat-num mono text-[11px] tracking-widest transition-colors"
                  style={{ color: "#444" }}
                >
                  {number}
                </span>
                <h3
                  className="text-lg font-semibold mt-3 mb-2"
                  style={{ color: "#e8e0d4" }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#666060" }}
                >
                  {body}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Profile preview ──────────────────────── */}
      <FadeUp>
        <div className="px-6 py-20" style={{ backgroundColor: "#242424" }}>
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
            {/* Mini profile card */}
            <div
              className="flex-shrink-0 w-[220px] rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: "#2a2a2a",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="relative h-[160px]">
                <img
                  src="https://i.pravatar.cc/300?img=47"
                  alt=""
                  className="w-full h-full object-cover object-top"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(36,36,36,0.85) 0%, transparent 60%)",
                  }}
                />
                <span
                  className="absolute top-3 right-3 text-white font-semibold rounded-full px-2 py-0.5"
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    background: "#018c50",
                  }}
                >
                  Active
                </span>
                {/* NFC pulse on card */}
                <div className="absolute top-3 left-3 w-5 h-5 flex items-center justify-center">
                  <div
                    className="absolute w-5 h-5 rounded-full border border-[#d4b483]/30 animate-ping"
                    style={{ animationDuration: "2.5s" }}
                  />
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: "#d4b483", opacity: 0.8 }}
                  />
                </div>
                <div className="absolute bottom-3 left-3">
                  <p
                    className="text-white font-semibold"
                    style={{ fontSize: "13px", lineHeight: 1.2 }}
                  >
                    Amara Osei-Bonsu
                  </p>
                  <p
                    style={{
                      color: "#aaa",
                      fontSize: "10px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Sr. Product Designer
                  </p>
                </div>
              </div>
              <div
                className="px-4 py-3 grid grid-cols-2 gap-2"
                style={{ backgroundColor: "#323232" }}
              >
                {[
                  ["Department", "Design"],
                  ["Level", "Senior"],
                  ["City", "New York"],
                  ["Tag ID", "AX-00412"],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p
                      style={{
                        fontSize: "8px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#555",
                        marginBottom: "2px",
                      }}
                    >
                      {l}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: l === "Tag ID" ? "#d4b483" : "#e8e0d4",
                        fontWeight: 500,
                      }}
                    >
                      {v}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Copy */}
            <div className="max-w-md">
              <p
                className="mono text-[11px] tracking-[0.2em] uppercase mb-4"
                style={{ color: "#d4b483" }}
              >
                The profile
              </p>
              <h2
                className="display text-[2.4rem] sm:text-[3.2rem] leading-none mb-5"
                style={{ color: "#e8e0d4", letterSpacing: "0.02em" }}
              >
                Tap the tag.
                <br />
                <span style={{ color: "#888" }}>See the person.</span>
              </h2>
              <p
                className="text-sm leading-relaxed mb-8"
                style={{ color: "#666060" }}
              >
                Every Abankese tag is paired to a live profile on Axis. Photo,
                role, contact, org chart position — presented cleanly the moment
                someone taps. No app download. No waiting.
              </p>
              <a
                href="#"
                className="btn-accent inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm"
              >
                See it live
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  className="w-3.5 h-3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ── CTA ──────────────────────────────────── */}
      <FadeUp className="py-28 px-6">
        <div
          className="max-w-5xl mx-auto rounded-3xl px-8 py-16 text-center relative overflow-hidden"
          style={{
            border: "1px solid rgba(255,255,255,0.07)",
            background: "#242424",
          }}
        >
          {/* glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 100%, rgba(212,180,131,0.06) 0%, transparent 65%)",
            }}
          />
          <div className="relative">
            <p
              className="mono text-[11px] tracking-[0.2em] uppercase mb-5"
              style={{ color: "#d4b483" }}
            >
              Get started
            </p>
            <h2
              className="display text-[3rem] sm:text-[4.5rem] leading-none mb-6"
              style={{ color: "#e8e0d4", letterSpacing: "0.02em" }}
            >
              Your team.
              <br />
              <span style={{ color: "#666060" }}>One tap away.</span>
            </h2>
            <p
              className="text-sm mb-10 max-w-xs mx-auto"
              style={{ color: "#666060" }}
            >
              Order your custom Abankese NFC tags, connect them to Axis, and go
              live in minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="#"
                className="btn-accent px-8 py-3.5 rounded-xl text-sm tracking-wide"
              >
                Order tags
              </a>
              <a
                href="#"
                className="btn-ghost px-8 py-3.5 rounded-xl text-sm font-medium tracking-wide"
              >
                Talk to us
              </a>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="px-6 py-8 divider border-t">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2 text-white items-center font-medium">
            <HiLightningBolt size={15} className="text-[#d4b483]" />
            <p>
              Abankese <span className="font-light text-[#d4b483]">Axis</span>
            </p>
          </div>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Status", "Contact"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-xs transition-colors hover:text-[#e8e0d4]"
                style={{ color: "#555" }}
              >
                {l}
              </a>
            ))}
          </div>
          <span className="mono text-[11px]" style={{ color: "#444" }}>
            © 2026 Abankese
          </span>
        </div>
      </footer>
    </div>
  );
}
