export function DetailItem({ label, value, accent }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] tracking-widest uppercase text-[#666060] font-medium">
        {label}
      </span>
      <span
        className={`text-[16px] leading-snug ${accent ? "text-[#d4b483]" : "text-[#e8e0d4]"}`}
      >
        {value}
      </span>
    </div>
  );
}
