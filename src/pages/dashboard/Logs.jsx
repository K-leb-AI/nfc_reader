import { useAuthStore } from "../../stores/authStore";
import { supabase } from "../../../superbaseClient";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { LuNfc } from "react-icons/lu";
import { MdPersonAdd } from "react-icons/md";

import { FiSearch, FiFilter, FiRefreshCw } from "react-icons/fi";
import { IoStatsChart } from "react-icons/io5";
import Loader from "../../components/Loader";
import ActivityRow from "../../components/ActivityRow";
import StatCard from "../../components/StatCard";

const EVENT_TYPES = [
  { value: "all", label: "All Events" },
  { value: "tap", label: "Card Taps" },
  { value: "create", label: "New Employees" },
  { value: "update", label: "Profile Updates" },
  { value: "assign", label: "Tag Assignments" },
  { value: "deactivate", label: "Deactivations" },
];

const ActivityLogs = () => {
  const { user, company_profile, profile_loading } = useAuthStore();
  const [logs, setLogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [stats, setStats] = useState(null);

  const fetchLogs = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("company_id", company_profile.id)
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) throw error;
      setLogs(data ?? []);

      console.log(data);

      // Compute quick stats
      const total = data.length;
      const taps = data.filter((l) => l.event_type === "tap").length;
      const creates = data.filter((l) => l.event_type === "create").length;
      const today = data.filter((l) => {
        const d = new Date(l.created_at);
        const now = new Date();
        return d.toDateString() === now.toDateString();
      }).length;

      setStats({ total, taps, creates, today });
    } catch (err) {
      console.error(err);
      toast.error("Could not load activity logs.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [profile_loading]);

  // ── Filter ──────────────────────────────────────────────
  useEffect(() => {
    let result = [...logs];

    if (typeFilter !== "all")
      result = result.filter((l) => l.event_type === typeFilter);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.employee_name?.toLowerCase().includes(q) ||
          l.tag_id?.toLowerCase().includes(q) ||
          l.event_type?.toLowerCase().includes(q) ||
          l.employee_id?.toLowerCase().includes(q),
      );
    }

    setFiltered(result);
  }, [logs, typeFilter, search]);

  if (loading || profile_loading) return <Loader />;

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 text-fg-2">
      <div className="mx-auto flex flex-col gap-6">
        {/* ── Header ── */}
        <div className="flex items-start justify-end gap-4 flex-wrap">
          <button
            onClick={() => fetchLogs(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium border border-white/8 text-fg-2/50 hover:border-white/20 hover:text-fg-2 transition-all duration-150 disabled:opacity-40"
          >
            <FiRefreshCw
              size={13}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* ── Stat cards ── */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              label="Total Events"
              value={stats.total}
              icon={<IoStatsChart size={16} />}
            />
            <StatCard
              label="Today"
              value={stats.today}
              icon={<LuNfc size={16} />}
              accent="#d4b483"
            />
            <StatCard
              label="Card Taps"
              value={stats.taps}
              icon={<LuNfc size={16} />}
              accent="#d4b483"
            />
            <StatCard
              label="New Employees"
              value={stats.creates}
              icon={<MdPersonAdd size={16} />}
              accent="#018c50"
            />
          </div>
        )}

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] pointer-events-none"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, tag, or event…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px] bg-bg-2 border border-white/8 text-fg-2 focus:border-accent/40 transition-all duration-150"
            />
          </div>

          {/* Type filter */}
          <div className="relative">
            <FiFilter
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] pointer-events-none"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-8 pr-4 py-2.5 rounded-xl text-[13px] bg-bg-2 border border-white/8 text-fg-2 focus:border-accent/40 transition-all duration-150 appearance-none cursor-pointer focus:outline-none"
            >
              {EVENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Logs table ── */}
        <div className="rounded-2xl overflow-hidden bg-bg-2 border border-white/5">
          {/* Table header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-white/6">
            <h2 className="text-[11px] tracking-widest uppercase font-semibold text-[#888]">
              Events
            </h2>
            <span className="mono text-[11px] text-[#555]">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-[#444]">
              <IoStatsChart size={32} className="opacity-30" />
              <p className="text-sm">
                {search || typeFilter !== "all"
                  ? "No events match your filters."
                  : "No activity yet."}
              </p>
              {(search || typeFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setTypeFilter("all");
                  }}
                  className="text-[12px] text-accent hover:opacity-70 transition-opacity"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div>
              {filtered.map((log) => (
                <ActivityRow key={log.id} log={log} />
              ))}
            </div>
          )}

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="px-4 sm:px-5 py-3 border-t border-white/6 flex items-center justify-between">
              <span className="text-[11px] text-[#555]">
                Showing {filtered.length} of {logs.length} events
              </span>
              {logs.length >= 200 && (
                <span className="text-[11px] text-[#555]">
                  Showing latest 200 — refine filters to see more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
