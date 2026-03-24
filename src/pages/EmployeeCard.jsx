import { useState, useEffect } from "react";
import { DetailItem } from "../components/detailItem";
import { PhoneIcon, ChatIcon, LinkIcon, MailIcon } from "../components/icons";
import { formatDate } from "../utils";
import { supabase } from "../../superbaseClient";
import Loader from "../components/Loader";
// import { employee } from "../data";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import NotFound from "../components/NotFound";
import { HiLightningBolt } from "react-icons/hi";

export default function EmployeeProfile() {
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [employee, setEmployee] = useState();

  const { id } = useParams();

  const copy = () => {
    navigator.clipboard.writeText(emp.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("employee")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) {
          return toast.error(`Error fetching employee data: `, error.message);
        }
        setEmployee(data);
        console.log(data);
        if (data) toast.success(`Fetched employee data successfully`);
      } catch (e) {
        console.log(`Error fetching employee data`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center p-4 sm:p-6">
      <div className="flex gap-2 text-3xl text-white items-center absolute top-10 md:top-30 font-bold">
        <HiLightningBolt size={25} className="text-[#ffa928]" />
        <p>
          Abankese <span className="font-light text-[#ffa928]">Axis</span>
        </p>
      </div>
      {!employee && <NotFound employeeId={id} />}
      {employee && (
        <div className="body bg-[#242424] rounded-3xl w-full max-w-[320px] sm:max-w-none sm:w-auto flex flex-col sm:flex-row gap-0 sm:gap-0 overflow-hidden">
          {/* ── Left column: Photo + actions ── */}
          <div className="flex flex-col sm:w-70 md:w-90 shrink-0">
            {/* Photo */}
            <div className="relative overflow-hidden h-70 sm:h-85 md:h-full sm:min-h-105">
              <img
                src={employee.img_url}
                alt={employee.name}
                className="w-full h-full object-cover object-top"
              />
              {/* vignette */}
              <div className="absolute inset-0 bg-linear-to-t from-[#242424]/80 via-transparent to-transparent" />

              {/* Status badge */}
              <span
                className={`absolute top-4 left-4 text-[10px] tracking-widest uppercase font-semibold px-2 py-1 rounded-full text-white ${
                  employee.is_active ? " bg-[#018c50]" : "bg-[#c41f1f]"
                }`}
              >
                {employee.is_active ? "Active" : "Inactive"}
              </span>

              {/* Name overlay */}
              <div className="absolute bottom-5 left-4">
                <h1 className="display text-[2.2rem] sm:text-[2.6rem] text-white leading-[0.92]">
                  {employee.name}
                </h1>
                <span className="text-[#cdcdcd] text-sm tracking-widest">
                  {employee.role}
                </span>
              </div>
            </div>

            {/* Action icons */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-white/6">
              {[
                { icon: <PhoneIcon />, action: () => {}, title: "Call" },
                { icon: <ChatIcon />, action: () => {}, title: "Message" },
                { icon: <LinkIcon />, action: () => {}, title: "Link" },
                {
                  icon: <MailIcon />,
                  action: copy,
                  title: copied ? "Copied!" : "Copy email",
                },
              ].map(({ icon, action, title }, i) => (
                <button
                  key={i}
                  onClick={action}
                  title={title}
                  className="icon-btn w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/6 flex items-center justify-center text-[#888] transition-all duration-150"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px bg-white/6 self-stretch" />
          <div className="sm:hidden h-px bg-white/6 mx-5" />

          {/* ── Right column: Details ── */}
          <div className="flex flex-col flex-1 px-5 sm:px-7 py-5 sm:py-6 min-w-0">
            <h2 className="text-xs sm:text-sm tracking-widest uppercase text-[#888] font-semibold mb-6 sm:mb-8">
              Professional Details
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-5 sm:gap-x-35 gap-y-4 sm:gap-y-5">
              <DetailItem label="Name" value={employee.name} />
              <DetailItem label="Phone" value={employee.phone} />
              <DetailItem label="Email" value={employee.email.split("@")[0]} />
              <DetailItem label="Department" value={employee.department} />
              <DetailItem label="Job Title" value={employee.role} />
              <DetailItem label="Level" value={employee.level} />
              <DetailItem label="Manager" value={employee.manager} />
              <DetailItem label="City" value={employee.city} />
              <DetailItem label="Account Name" value={employee.account_name} />
              <DetailItem label="Contact ID" value={employee.id} accent />
            </div>

            {/* Member since */}
            <div className="px-5 py-3 rounded-2xl mt-8 flex items-center gap-3 bg-white/2">
              <span className="text-[10px] tracking-widest uppercase text-[#666060]">
                Member since
              </span>
              <span className="mono text-sm sm:text-base text-[#888]">
                {formatDate(employee.created_at)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
