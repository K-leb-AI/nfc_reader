import { RiDashboardFill } from "react-icons/ri";
import { FaUser, FaCreditCard } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { HiLightningBolt } from "react-icons/hi";
import { TbLogout } from "react-icons/tb";
import { useAuthStore } from "../../stores/authStore";
import Unauthenticated from "../../components/Unauthenticated";
import Loader from "../../components/Loader";
import { useNavigate, Outlet } from "react-router-dom";
import { useNavStore } from "../../stores/navStore";
import { supabase } from "../../../superbaseClient";
import { useEffect } from "react";
import { useEmpStore } from "../../stores/employeeStore";
import { useActivityStore } from "../../stores/activityStore";

const DashboardLayout = () => {
  const {
    signOut,
    user,
    setCompanyProfile,
    company_profile,
    auth_loading,
    profile_loading,
  } = useAuthStore();
  const { setEmployees, employees } = useEmpStore();
  const navLinks = [
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: <RiDashboardFill size={12} />,
    },
    {
      name: "Employees",
      link: "/dashboard/employees",
      icon: <FaUser size={12} />,
    },
    // {
    //   name: "NFC Card Orders",
    //   link: "/dashboard/orders",
    //   icon: <FaCreditCard size={12} />,
    // },
    {
      name: "Activity Logs",
      link: "/dashboard/logs",
      icon: <IoStatsChart size={12} />,
    },
    {
      name: "Organization Settings",
      link: "/dashboard/settings",
      icon: <IoMdSettings size={12} />,
    },
  ];
  const { activeLink, setActiveLink } = useNavStore();
  const navigate = useNavigate();
  const { storeLogs, setStoreLogs } = useActivityStore();

  useEffect(() => {
    if (!user?.id) return;
    const getCompanyData = async () => {
      try {
        const { data: companyData, error } = await supabase
          .from("company")
          .select("*")
          .eq("auth_id", user.id)
          .single();

        if (error) throw error;
        setCompanyProfile(companyData);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };
    getCompanyData();
  }, [user?.id]);

  useEffect(() => {
    const getEmployeeData = async () => {
      try {
        const { data: employeeData, error: employeeError } = await supabase
          .from("employee")
          .select("*")
          .eq("company_id", company_profile.id);
        if (employeeError) {
          throw employeeError;
        } else {
          setEmployees(employeeData);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    const fetchLogs = async () => {
      try {
        const { data: logData, error: logError } = await supabase
          .from("activity_logs")
          .select("*")
          .eq("company_id", company_profile.id)
          .order("created_at", { ascending: false });

        if (logError) throw logError;
        else setStoreLogs(logData);
      } catch (err) {
        console.error("Error loading activity logs:", err);
      }
    };

    getEmployeeData();
    fetchLogs();
  }, [company_profile, employees, storeLogs]);

  if (auth_loading || profile_loading) {
    return <Loader />;
  }
  if (!user) {
    return <Unauthenticated />;
  }
  return (
    <div className="drawer md:drawer-open w-screen min-h-screen">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar w-full bg-bg-2 border-b border-fg/10 py-4 px-6 sticky top-0 z-1000">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            {/* Sidebar toggle icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div className="px-4 capitalize">{activeLink}</div>
        </nav>
        {/* Page content here */}
        <div className="p-4">
          <Outlet /> {/* This will render the child routes */}
        </div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible border-r border-fg/10 bg-bg-2">
        <div className="flex-col min-h-[98vh] flex justify-between pt-10">
          <div className="">
            <div className="mb-15 px-5">
              <div className="flex gap-1 text-3xl text-fg items-center font-medium">
                <HiLightningBolt
                  size={15}
                  className="text-accent is-drawer-close:tooltip is-drawer-close:tooltip-right"
                />
                <p className="text-2xl is-drawer-close:hidden">Axis</p>
              </div>
            </div>
            <div className="flex min-h-full flex-col items-start is-drawer-close:w-14 is-drawer-open:w-64">
              {/* Sidebar content here */}
              <ul className="menu w-full grow">
                {navLinks.map((link, index) => (
                  <li
                    key={index}
                    className="w-full is-drawer-close:mb-3 is-drawer-open:mb-0"
                    onClick={() => {
                      setActiveLink(link.name);
                      navigate(link.link);
                    }}
                  >
                    <button
                      className={
                        activeLink === link.name
                          ? "bg-accent text-bg-2 py-3 w-full"
                          : "is-drawer-close:tooltip is-drawer-close:tooltip-right py-3"
                      }
                      data-tip={link.name}
                    >
                      <div className="aspect-square">{link.icon}</div>
                      <span className="is-drawer-close:hidden text-[12px] py-2">
                        {link.name}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="is-drawer-close:mb-3 is-drawer-open:mb-0 hover:bg-red-500/5 rounded-2xl mx-2 duration-200 hover:text-red-400 cursor-pointer"
            onClick={() => {
              signOut();
              navigate("/");
            }}
          >
            <button
              className="is-drawer-close:tooltip is-drawer-close:tooltip-right rounded-2xl py-3 flex items-center px-5 gap-2 cursor-pointer"
              data-tip="Logout"
            >
              <div className="aspect-square">
                <TbLogout size={12} />
              </div>
              <span className="is-drawer-close:hidden text-[12px] py-2">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
