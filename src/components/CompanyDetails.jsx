import { useState } from "react";
// import { _sample } from "../data";

export default function CompanyDetails({ company = _sample }) {
  const co = company;
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(co.website);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const plan = co?.plan ?? "free";

  const companyActions = [
    {
      title: "Call",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
      ),
    },
    {
      title: "Email",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      title: copied ? "Copied!" : "Copy website",
      action: copy,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
        </svg>
      ),
    },
    {
      title: "More",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="flex items-center justify-center mt-10"
      style={{ backgroundColor: "#1c1c1e" }}
    >
      {co && (
        <div className="fade-in w-full rounded-3xl overflow-hidden">
          {/* ── Cover ── */}
          <div className="bg-[#242424] rounded-3xl">
            <div className="relative h-50" style={{ background: "#d4b48305" }}>
              <svg
                className="absolute inset-0 w-full h-full opacity-[0.04]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="grid"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 24 0 L 0 0 0 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 70%, rgba(212,180,131,0.07), transparent 65%)",
                }}
              ></div>

              {/* Logo */}
              <div className="absolute -bottom-10 left-5 w-40 aspect-square rounded-4xl overflow-hidden">
                <img
                  src={co.logo_url}
                  alt={co.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* ── Name & plan ── */}
            <div className="flex items-end justify-between flex-col sm:flex-row ">
              <div className="px-5 pt-15 pb-4">
                <h1
                  className="display text-[2.2rem] sm:text-[2.6rem] leading-none text-[#e8e0d4]"
                  style={{ letterSpacing: "0.02em" }}
                >
                  {co.name}
                </h1>
                <p className="text-white/60">
                  <span className="text-[#d4b483]">{co.address}</span>,{" "}
                  {co.city}, {co.country}
                </p>
              </div>

              {/* ── Action icons ── */}
              <div className="flex justify-between sm:gap-4 px-5 py-3 mb-2 w-full sm:w-fit">
                {companyActions.map(({ icon, title, action }, i) => (
                  <button
                    key={i}
                    onClick={action}
                    title={title}
                    className="icon-btn w-15 aspect-square rounded-full flex items-center justify-center transition-all duration-150"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      color: "#888",
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
