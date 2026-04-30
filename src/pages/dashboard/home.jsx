import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FaUsers, FaCreditCard, FaChevronRight, FaPlus } from "react-icons/fa";
import { HiLink } from "react-icons/hi";
import { IoStatsChart } from "react-icons/io5";
import { MdPersonAdd, MdFileDownload } from "react-icons/md";
import { LuNfc } from "react-icons/lu";

import { BiSearchAlt } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { useAuthStore } from "../../stores/authStore";
import { useEmpStore } from "../../stores/employeeStore";
import Loader from "../../components/Loader";
import { supabase } from "../../../superbaseClient";

const recentEmployees = [
  {
    id: "EMP-00123",
    name: "Hannah Brooks",
    role: "Junior Designer",
    department: "Design & Experience",
    img: "https://i.pravatar.cc/48?img=40",
    is_active: true,
    tag: "AX-0123",
  },
  {
    id: "EMP-00122",
    name: "David Osei",
    role: "Security Engineer",
    department: "Engineering",
    img: "https://i.pravatar.cc/48?img=16",
    is_active: true,
    tag: "AX-0122",
  },
  {
    id: "EMP-00121",
    name: "Mei Lin",
    role: "Content Strategist",
    department: "Marketing",
    img: "https://i.pravatar.cc/48?img=46",
    is_active: true,
    tag: "AX-0121",
  },
  {
    id: "EMP-00120",
    name: "Oliver Stein",
    role: "Finance Analyst",
    department: "Finance",
    img: "https://i.pravatar.cc/48?img=14",
    is_active: false,
    tag: "AX-0120",
  },
  {
    id: "EMP-00119",
    name: "Zara Ahmed",
    role: "HR Manager",
    department: "People & Culture",
    img: "https://i.pravatar.cc/48?img=42",
    is_active: true,
    tag: "AX-0119",
  },
];
const activity = [
  {
    type: "tap",
    label: "Card tapped",
    sub: "AX-0123 · Hannah Brooks",
    time: "2m ago",
  },
  {
    type: "create",
    label: "Employee added",
    sub: "Hannah Brooks · EMP-00123",
    time: "1h ago",
  },
  {
    type: "tap",
    label: "Card tapped",
    sub: "AX-0119 · Zara Ahmed",
    time: "3h ago",
  },
  {
    type: "assign",
    label: "Tag assigned",
    sub: "AX-0122 → David Osei",
    time: "5h ago",
  },
  {
    type: "tap",
    label: "Card tapped",
    sub: "AX-0121 · Mei Lin",
    time: "Yesterday",
  },
];
const activityColor = { tap: "#d4b483", create: "#018c50", assign: "#888" };
const ActivityIcon = ({ type }) => {
  if (type === "tap") return <LuNfc size={10} />;
  if (type === "create") return <MdPersonAdd size={10} />;
  return <HiLink size={10} />;
};
const tapData = [
  { day: "Mar 14", taps: 28 },
  { day: "Mar 15", taps: 42 },
  { day: "Mar 16", taps: 35 },
  { day: "Mar 17", taps: 61 },
  { day: "Mar 18", taps: 48 },
  { day: "Mar 19", taps: 74 },
  { day: "Mar 20", taps: 55 },
  { day: "Mar 21", taps: 90 },
  { day: "Mar 22", taps: 67 },
  { day: "Mar 23", taps: 28 },
  { day: "Mar 24", taps: 42 },
  { day: "Mar 25", taps: 35 },
  { day: "Mar 26", taps: 61 },
  { day: "Mar 27", taps: 48 },
  { day: "Mar 28", taps: 74 },
  { day: "Mar 29", taps: 55 },
  { day: "Mar 30", taps: 90 },
  { day: "Mar 31", taps: 67 },
  { day: "Apr 1", taps: 83 },
  { day: "Apr 2", taps: 102 },
  { day: "Apr 3", taps: 91 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2 text-[12px]"
      style={{
        background: "#2e2926",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#e8e0d4",
      }}
    >
      <p className="mono text-[10px] mb-1" style={{ color: "#666060" }}>
        {label}
      </p>
      <p className="font-semibold" style={{ color: "#d4b483" }}>
        {payload[0].value} taps
      </p>
    </div>
  );
};

const quickActions = [
  { label: "Add employee", icon: <MdPersonAdd size={14} /> },
  { label: "Assign NFC tag", icon: <LuNfc size={14} /> },
  { label: "Export roster", icon: <MdFileDownload size={14} /> },
];

export default function Dashboard() {
  const [searchQ, setSearchQ] = useState("");

  const { company_profile: company, profile_loading } = useAuthStore();
  const filtered = recentEmployees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQ.toLowerCase()) ||
      e.role.toLowerCase().includes(searchQ.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQ.toLowerCase()),
  );

  const { employees, setEmployees } = useEmpStore();

  const stats = [
    {
      label: "Total Employees",
      value: employees.length,
      sub: "+3 this month",
      accent: false,
      icon: <FaUsers size={16} />,
    },
    {
      label: "Active Cards",
      value: 21,
      sub: "3 unassigned",
      accent: false,
      icon: <FaCreditCard size={16} />,
    },
    {
      label: "Tags Issued",
      value: 24,
      sub: "All linked",
      accent: true,
      icon: <LuNfc size={16} />,
    },
    {
      label: "Tap Events",
      value: 1240,
      sub: "Last 30 days",
      accent: false,
      icon: <IoStatsChart size={16} />,
    },
  ];

  useEffect(() => {
    const fetchTapCount = async () => {
      const { count, error } = await supabase
        .from("activity_logs")
        .select("*", { count: "exact", head: true })
        .gte("created_at", "2026-04-08T00:00:00Z")
        .lte("created_at", "2026-04-29T23:59:59Z");

      console.log(count);
    };

    fetchTapCount();
  }, []);

  if (profile_loading) {
    return <Loader />;
  }

  return (
    <div
      className="min-h-screen p-4 sm:p-6 md:p-8"
      style={{ backgroundColor: "#1c1c1e", color: "#e8e0d4" }}
    >
      <div className="">
        {/* ── Top bar ── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-fg/10">
              <img
                src={company.logo_url}
                alt={company.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm tracking-widest uppercase text-[#666060] mb-0.5">
                Overview
              </p>
              <h1 className="text-[1.4rem] leading-none font-bold text-fg">
                {company.firm_name || "Your Company Name"}
              </h1>
            </div>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-2xl p-4 flex flex-col gap-3 bg-bg-2 border border-fg/5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-widest uppercase font-medium text-[#666060]">
                  {stat.label}
                </span>
                <span className="text-white/10">{stat.icon}</span>
              </div>
              <div>
                <span className="text-[2.2rem] leading-none text-fg-2 tracking-wide font-bold">
                  {stat.value.toLocaleString()}
                </span>
                <p className="text-[11px] mt-1 text-[#555]">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tap events chart ── */}
        <div
          className="rounded-2xl p-5 mb-3"
          style={{
            background: "#242424",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p
                className="text-[10px] tracking-widest uppercase font-semibold mb-0.5"
                style={{ color: "#888" }}
              >
                Tap Events
              </p>
              <p className="text-[11px]" style={{ color: "#555" }}>
                Last 3 weeks
              </p>
            </div>
            <span
              className="text-[1.8rem] leading-none"
              style={{ color: "#d4b483", letterSpacing: "0.02em" }}
            >
              1,240
            </span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart
              data={tapData}
              margin={{ top: 0, right: 0, left: -28, bottom: 0 }}
            >
              <defs>
                <linearGradient id="tapGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4b483" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#d4b483" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="day"
                tick={{ fill: "#444", fontSize: 10, fontFamily: "DM Mono" }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                tick={{ fill: "#444", fontSize: 10, fontFamily: "DM Mono" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "rgba(212,180,131,0.15)", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="taps"
                stroke="#d4b483"
                strokeWidth={1.5}
                fill="url(#tapGrad)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#d4b483",
                  stroke: "#242424",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid md:grid-cols-[1fr_260px] gap-3">
          {/* Employees table */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "#242424",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {/* table header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <h2
                className="text-[11px] tracking-widest uppercase font-semibold"
                style={{ color: "#888" }}
              >
                Recent Employees
              </h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <BiSearchAlt
                    size={14}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "#444" }}
                  />
                  <input
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder="Search…"
                    className="pl-7 pr-3 py-1.5 rounded-lg text-[12px] transition-all duration-150"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "#e8e0d4",
                      width: "130px",
                    }}
                  />
                </div>
                <button
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-all duration-150"
                  style={{
                    color: "#666060",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <MdFileDownload size={14} />
                  Export
                </button>
              </div>
            </div>

            {/* col headers */}
            <div
              className="grid px-5 py-2"
              style={{
                gridTemplateColumns: "1fr 1fr auto auto",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {["Employee", "Department", "Tag", "Status"].map((h) => (
                <span
                  key={h}
                  className="text-[10px] tracking-widest uppercase"
                  style={{ color: "#444" }}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* rows */}
            {filtered.length === 0 ? (
              <div
                className="py-12 text-center text-[13px]"
                style={{ color: "#444" }}
              >
                No employees match your search.
              </div>
            ) : (
              filtered.map((emp, i) => (
                <div
                  key={emp.id}
                  className="row-hover grid items-center px-5 py-3 cursor-pointer transition-colors duration-100"
                  style={{
                    gridTemplateColumns: "1fr 1fr auto auto",
                    borderBottom:
                      i < filtered.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={emp.img}
                      alt={emp.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                      style={{ border: "1.5px solid rgba(255,255,255,0.07)" }}
                    />
                    <div className="min-w-0">
                      <p
                        className="text-[13px] font-medium truncate"
                        style={{ color: "#e8e0d4" }}
                      >
                        {emp.name}
                      </p>
                      <p
                        className="mono text-[10px] truncate"
                        style={{ color: "#555" }}
                      >
                        {emp.id}
                      </p>
                    </div>
                  </div>
                  <div className="min-w-0 pr-4">
                    <p
                      className="text-[12px] truncate"
                      style={{ color: "#888" }}
                    >
                      {emp.department}
                    </p>
                    <p
                      className="text-[11px] truncate"
                      style={{ color: "#555" }}
                    >
                      {emp.role}
                    </p>
                  </div>
                  <span
                    className="mono text-[11px] mr-6"
                    style={{ color: "#d4b483" }}
                  >
                    {emp.tag}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-[10px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: emp.is_active
                          ? "rgba(1,140,80,0.15)"
                          : "rgba(255,255,255,0.05)",
                        color: emp.is_active ? "#018c50" : "#555",
                      }}
                    >
                      {emp.is_active ? "Active" : "Off"}
                    </span>
                    <FaChevronRight size={10} style={{ color: "#444" }} />
                  </div>
                </div>
              ))
            )}

            {/* footer */}
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="text-[11px]" style={{ color: "#555" }}>
                Showing {filtered.length} of {recentEmployees.length}
              </span>
              <button
                className="text-[11px] tracking-widest uppercase font-semibold hover:opacity-70 transition-opacity"
                style={{ color: "#d4b483" }}
              >
                View all →
              </button>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-3">
            {/* Quick actions */}
            <div
              className="rounded-2xl p-4"
              style={{
                background: "#242424",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <h3
                className="text-[10px] tracking-widest uppercase font-semibold mb-3"
                style={{ color: "#888" }}
              >
                Quick Actions
              </h3>
              <div className="flex flex-col gap-2">
                {quickActions.map(({ label, icon }) => (
                  <button
                    key={label}
                    className="action-btn flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[12px] font-medium text-left w-full transition-all duration-150"
                    style={{
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "#888",
                      background: "transparent",
                    }}
                  >
                    <span style={{ color: "#555" }}>{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity feed */}
            <div
              className="rounded-2xl p-4 flex-1"
              style={{
                background: "#242424",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <h3
                className="text-[10px] tracking-widest uppercase font-semibold mb-4"
                style={{ color: "#888" }}
              >
                Recent Activity
              </h3>
              <div className="flex flex-col">
                {activity.map((a, i) => (
                  <div
                    key={i}
                    className="flex gap-3 pb-4 relative"
                    style={{
                      borderLeft:
                        i < activity.length - 1
                          ? "1px solid rgba(255,255,255,0.06)"
                          : "none",
                      marginLeft: "7px",
                      paddingLeft: "16px",
                    }}
                  >
                    <div
                      className="absolute -left-1.75 top-0 w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: "#242424",
                        border: `1.5px solid ${activityColor[a.type]}`,
                        color: activityColor[a.type],
                      }}
                    >
                      <ActivityIcon type={a.type} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[12px] font-medium leading-tight"
                        style={{ color: "#e8e0d4" }}
                      >
                        {a.label}
                      </p>
                      <p
                        className="mono text-[10px] mt-0.5 truncate"
                        style={{ color: "#555" }}
                      >
                        {a.sub}
                      </p>
                      <p className="text-[10px] mt-1" style={{ color: "#444" }}>
                        {a.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fab md:hidden bottom-10 right-10 absolute">
        <div
          tabIndex="0"
          role="button"
          className="btn btn-lg btn-circle bg-accent text-bg-2 w-17 h-17"
        >
          <FaPlus size={20} />
        </div>

        <div className="fab-close">
          <span className="btn btn-lg btn-circle bg-red-500 w-17 h-17">✕</span>
        </div>

        <div>
          Add an Employee
          <button className="btn btn-lg btn-circle w-17 h-17">A</button>
        </div>
        <div>
          Add Bulk Employee Data
          <button className="btn btn-lg btn-circle w-17 h-17">B</button>
        </div>
      </div>
    </div>
  );
}
