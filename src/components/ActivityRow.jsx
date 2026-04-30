import { useState } from "react";
import { LuNfc } from "react-icons/lu";
import { MdPersonAdd, MdPersonRemove, MdEdit } from "react-icons/md";
import { HiLink } from "react-icons/hi";
import { IoStatsChart } from "react-icons/io5";
import { formatLogDate, fullDate } from "../utils";

const EVENT_META = {
  tap: { label: "Card tapped", color: "#d4b483", Icon: LuNfc },
  create: { label: "Employee added", color: "#018c50", Icon: MdPersonAdd },
  update: { label: "Profile updated", color: "#888", Icon: MdEdit },
  assign: { label: "Tag assigned", color: "#6b9adf", Icon: HiLink },
  deactivate: {
    label: "Employee removed",
    color: "#e05a5a",
    Icon: MdPersonRemove,
  },
};

function ActivityRow({ log }) {
  const [expanded, setExpanded] = useState(false);
  const meta = EVENT_META[log.event_type] ?? {
    label: log.event_type,
    color: "#888",
    Icon: IoStatsChart,
  };
  const { Icon, color, label } = meta;

  return (
    <div
      onClick={() => setExpanded((p) => !p)}
      className="px-4 sm:px-5 py-3.5 cursor-pointer transition-colors duration-100 hover:bg-white/3 border-b border-white/5 last:border-0"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Icon dot */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-00"
          style={{
            background: `color-mix(in srgb, ${color} 15%, transparent)`,
            color,
          }}
        >
          <Icon size={13} />
        </div>

        {/* Label + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <p className="text-[13px] text-fg-2">
              {log.description_text || "Unknown Action"}
            </p>
          </div>
          {log.tag_id && (
            <p className="mono text-[10px] text-[#555] mt-0.5">{log.tag_id}</p>
          )}
        </div>

        {/* Time */}
        <span
          className="text-[11px] text-[#555] shrink-0 hidden sm:block"
          title={fullDate(log.created_at)}
        >
          {formatLogDate(log.created_at)}
        </span>

        {/* Type badge */}
        <span
          className="text-[10px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded-full shrink-0"
          style={{
            background: `color-mix(in srgb, ${color} 12%, transparent)`,
            color,
          }}
        >
          {log.event_type}
        </span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="mt-3 ml-10 sm:ml-11 pl-3 border-l border-white/8 flex flex-col gap-1.5">
          <p className="text-[11px] text-[#666060]">
            <span className="text-[#555] mr-2">Time</span>
            {fullDate(log.created_at)}
          </p>
          {log.employee_id && (
            <p className="text-[11px] text-[#666060]">
              <span className="text-[#555] mr-2">Employee ID</span>
              <span className="mono">{log.employee_id}</span>
            </p>
          )}
          {log.tag_id && (
            <p className="text-[11px] text-[#666060]">
              <span className="text-[#555] mr-2">Tag</span>
              <span className="mono">{log.tag_id}</span>
            </p>
          )}
          {log.metadata && (
            <p className="text-[11px] text-[#666060]">
              <span className="text-[#555] mr-2">Details</span>
              {typeof log.metadata === "object"
                ? JSON.stringify(log.metadata)
                : log.metadata}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ActivityRow;
