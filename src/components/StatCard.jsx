function StatCard({ label, value, icon, accent }) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-3 bg-bg-2 border border-white/5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-widest uppercase font-medium text-[#666060]">
          {label}
        </span>
        <span style={{ color: accent ?? "#444" }}>{icon}</span>
      </div>
      <span
        className="text-3xl font-bold leading-none text-fg-2"
        style={{ letterSpacing: "0.02em" }}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

export default StatCard;
