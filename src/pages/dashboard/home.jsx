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
import { AiFillProfile } from "react-icons/ai";
import { IoIosExit } from "react-icons/io";
import { LuNfc } from "react-icons/lu";

import { BiSearchAlt } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { useAuthStore } from "../../stores/authStore";
import { useEmpStore } from "../../stores/employeeStore";
import Loader from "../../components/Loader";
import { supabase } from "../../../superbaseClient";
import { useMediaQuery } from "react-responsive";
import { useActivityStore } from "../../stores/activityStore";
import { formatLogDate } from "../../utils";

const activityColor = {
  card_tap: "#d4b483",
  new_employee: "#018c50",
  profile_update: "#85d2e0",
  deactivation: "#e05353",
  order: "#40b958",
};
const ActivityIcon = ({ type }) => {
  if (type === "card_tap") return <LuNfc size={10} />;
  if (type === "new_employee") return <MdPersonAdd size={10} />;
  if (type === "profile_update") return <AiFillProfile size={10} />;
  if (type === "deactivation") return <IoIosExit size={10} />;
  if (type === "order") return <FaCreditCard size={10} />;
  // return <HiLink size={10} />;
};

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
  const profile_loading = useAuthStore((state) => state.profile_loading);
  const company_profile = useAuthStore((state) => state.company_profile);
  const [searchQ, setSearchQ] = useState("");
  const [tapData, setTapData] = useState([]);
  const [fetchingTaps, setFetchingTaps] = useState(true);
  const [tapCount, setTapCount] = useState(0);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const { employees, setEmployees } = useEmpStore();
  const recentEmps = employees
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .slice(0, 8);
  const filtered = recentEmps.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQ.toLowerCase()) ||
      e.role.toLowerCase().includes(searchQ.toLowerCase()) ||
      e.department.toLowerCase().includes(searchQ.toLowerCase()) ||
      String(e.id).includes(searchQ.toLowerCase()),
  );

  const stats = [
    {
      label: "Total Employees",
      value: employees.length,
      sub: "+3 this month",
      accent: false,
      icon: <FaUsers size={16} />,
    },
    {
      label: "Active Employee Profile",
      value: employees.filter((emp) => emp.is_active === true).length,
      sub: `${employees.length - employees.filter((emp) => emp.is_active === true).length} inactive`,
      accent: false,
      icon: <FaCreditCard size={16} />,
    },
    {
      label: "Attendance Events Created",
      value: 24,
      sub: "All linked",
      accent: true,
      icon: <LuNfc size={16} />,
    },
    {
      label: "Tap Events",
      value: tapCount,
      sub: "Last 30 days",
      accent: false,
      icon: <IoStatsChart size={16} />,
    },
  ];

  const { storeLogs, setLoading } = useActivityStore();
  console.log(storeLogs);
  const [recentLogs, setRecentLogs] = useState();

  useEffect(() => {
    const fetchTaps = async () => {
      if (!company_profile?.id) {
        setFetchingTaps(false);
        return;
      }

      setFetchingTaps(true);
      const now = new Date().toISOString();
      const threeWeeksAgo = new Date(
        Date.now() - 3 * 7 * 24 * 60 * 60 * 1000,
      ).toISOString();
      try {
        const { data, error } = await supabase
          .from("activity_logs")
          .select("created_at")
          .eq("event_type", "card_tap")
          .eq("company_id", company_profile.id)
          .gte("created_at", threeWeeksAgo)
          .lte("created_at", now);

        if (error) throw error;

        const tapsByDay = data.reduce((acc, row) => {
          const day = row.created_at.slice(0, 10); // "2026-04-28"
          acc[day] = (acc[day] || 0) + 1;
          return acc;
        }, {});

        const allDays = Array.from({ length: 21 }, (_, i) => {
          const d = new Date(Date.now() - (20 - i) * 24 * 60 * 60 * 1000);
          return d.toISOString().slice(0, 10); // "2026-04-28"
        });

        const chartData = allDays.map((date) => ({
          date: new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          count: tapsByDay[date] || 0,
        }));

        setTapData(chartData);
        setTapCount(
          chartData.reduce((acc, { count }) => {
            return acc + count;
          }, 0),
        );
      } catch (e) {
        console.log("Error fetching taps: ", e);
      } finally {
        setFetchingTaps(false);
      }
    };
    fetchTaps();
  }, [company_profile]);

  useEffect(() => {
    setRecentLogs(storeLogs.sort().slice(0, 5));
  }, [storeLogs]);

  if (profile_loading || fetchingTaps) {
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
                src={company_profile.logo_url}
                alt={company_profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm tracking-widest uppercase text-[#666060] mb-0.5">
                Overview
              </p>
              <h1 className="text-[1.4rem] leading-none font-bold text-fg">
                {company_profile.firm_name || "Your Company Name"}
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
                <span className="text-[10px] tracking-widest uppercase font-medium text-[#606661]">
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
              {tapCount}
            </span>
          </div>
          <ResponsiveContainer
            width="100%"
            height={160}
            style={{
              outline: "0px",
            }}
          >
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
                dataKey="date"
                tick={{ fill: "#444", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                tick={{ fill: "#444", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "rgba(212,180,131,0.15)", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="count"
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
                    className="pl-10 pr-3 py-1.5 rounded-lg text-[12px] transition-all duration-150 bg-fg/5 border border-fg/7 text-fg-2 w-64 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* col headers */}
            <div
              className="grid px-5 py-2"
              style={{
                gridTemplateColumns: "1fr 1fr auto",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {["Employee", "Department", "Status"].map((h) => (
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
                <div className="relative" key={emp.id}>
                  <div
                    className={
                      "row-hover grid items-center pr-5 py-3 cursor-pointer transition-colors duration-100 pl-5"
                    }
                    style={{
                      gridTemplateColumns: "1fr 1fr 40px",
                      borderBottom:
                        i < filtered.length - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : "none",
                    }}
                    // onClick={() => {
                    //   document.getElementById("my_modal_5").showModal();
                    // }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {emp.img_url ? (
                        <img
                          src={emp.img_url}
                          alt={emp.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/7"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full shrink-0 border border-white/7 text-fg/50 grid place-items-center leading-0 bg-bg/20 font-semibold">
                          {emp.name[0]}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[13px] truncate text-fg">
                          {emp.name}
                        </p>
                        <p className="mono text-[10px] truncate text-[#555]">
                          {isMobile
                            ? `${emp.department} . ${emp.role}`
                            : `${emp.id}`}
                        </p>
                      </div>
                    </div>

                    <div className="text-[10px] truncate">
                      {!isMobile && (
                        <div className="flex flex-col">
                          <p className="text-fg-2/70 text-[12px]">
                            {emp.department}
                          </p>
                          <p className="mono text-[#555]">{emp.role}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-3">
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
                    {/* Modal */}
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
                Showing {filtered.length} of {recentEmps.length}
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
                {recentLogs.map((a, i) => (
                  <div
                    key={i}
                    className="flex gap-3 pb-4 relative ml-2 pl-6"
                    style={{
                      borderLeft:
                        i < recentLogs.length - 1
                          ? "1px solid rgba(255,255,255,0.06)"
                          : "none",
                    }}
                  >
                    <div
                      className="absolute -left-3.25 top-0 w-6.5 aspect-square rounded-full flex items-center justify-center shrink-0 "
                      style={{
                        background: "#242424",
                        border: `1.5px solid ${activityColor[a.event_type]}`,
                        color: activityColor[a.event_type],
                      }}
                    >
                      <ActivityIcon type={a.event_type} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[12px] font-medium leading-tight"
                        style={{ color: "#e8e0d4" }}
                      >
                        {a.description_text}
                      </p>
                      <p
                        className="mono text-[10px] mt-0.5 truncate"
                        style={{ color: "#555" }}
                      >
                        ID: {a.employee_id}
                      </p>
                      <p className="text-[10px] mt-1" style={{ color: "#444" }}>
                        {formatLogDate(a.created_at)}
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
