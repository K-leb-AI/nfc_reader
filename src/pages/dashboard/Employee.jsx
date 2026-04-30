import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { FaChevronRight, FaCreditCard, FaArrowRight } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import { BiSearchAlt } from "react-icons/bi";
import Loader from "../../components/Loader";
import { supabase } from "../../../superbaseClient";
import { useMediaQuery } from "react-responsive";
import { FaFilter, FaPlus } from "react-icons/fa6";
import EmployeeEditModal from "../../components/EmployeeEditModal";
import { useEmpStore } from "../../stores/employeeStore";
import { IoMdAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { IoIosCheckbox } from "react-icons/io";
import marketplace from "../../assets/marketplace.jpg";
import custom from "../../assets/custom.jpg";
import toast from "react-hot-toast";
import { useOrderList } from "../../stores/utilStores";
import AddEmployeeModal from "../../components/AddEmployeeModal";
import BulkModal from "../../components/BulkModal";

const Employee = () => {
  const [searchQ, setSearchQ] = useState("");
  const isMobile = useMediaQuery({ maxWidth: 767 });
  // const [employeeList, setEmployeeList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDep, setSelectedDep] = useState("All");
  const [isOrderTrig, setIsOrderTrig] = useState(false);
  const [isSelectMultiple, setIsSelectMultiple] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { employees, setEmployees, setSelectedEmployee, selectedEmployee } =
    useEmpStore();
  // const [orderList, setOrderList] = useState([]);
  const orderList = useOrderList((state) => state.orderList);
  const setOrderList = useOrderList((state) => state.setOrderList);
  const clearOrderList = useOrderList((state) => state.clearOrderList);
  const addOrderItem = useOrderList((state) => state.addOrderItem);
  const removeOrderItem = useOrderList((state) => state.removeOrderItem);

  let filtered = employees.filter(
    (e) =>
      e.name.toString().toLowerCase().includes(searchQ.toLowerCase()) ||
      e.role.toString().toLowerCase().includes(searchQ.toLowerCase()) ||
      e.id.toString().toLowerCase().includes(searchQ.toLowerCase()),
  );
  const { company_profile: company, profile_loading } = useAuthStore();
  const navigate = useNavigate();
  const handleDelete = async () => {
    if (orderList.length === 0) return;

    setIsDeleting(true);
    const { error } = await supabase
      .from("employee")
      .delete()
      .in("id", orderList);

    if (error) {
      console.log(error);
    }

    setEmployees(employees.filter((emp) => !orderList.includes(emp.id)));
    clearOrderList();
    setIsOrderTrig(false);
    document.querySelectorAll(".order_class").forEach((box) => {
      box.checked = false;
    });
  };

  useEffect(() => {
    const deps = [...new Set(employees.map((emp) => emp.department))];
    setDepartmentList(["All", ...deps]);
  }, [employees]);

  if (profile_loading) {
    return <Loader />;
  }

  return (
    <div className="drawer drawer-end">
      <input id="my-drawer-5" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <div className="p-4 sm:p-6 md:p-8 relative">
          <div
            className={`fixed z-10 font-bold bottom-10 left-1/2 -translate-x-1/2 rounded-full text-fg/60 transition-all duration-150 bg-button-bg/50s backdrop-blur-sm border border-fg-2/4 p-1 flex items-center gap-1 ${!isOrderTrig && "hidden"}`}
          >
            <IoClose
              size={20}
              className="cursor-pointer ml-2"
              onClick={() => {
                setIsOrderTrig(false);
                setOrderList([]);
                document.querySelectorAll(".order_class").forEach((box) => {
                  box.checked = false;
                });
              }}
            />
            {orderList.length} selected
            <div
              className="bg-red-500 rounded-full text-fg px-6 py-2 ml-2 cursor-pointer hover:bg-red-500/90 duration-300 hover:text-bg flex items-center gap-2"
              onClick={() => {
                if (orderList.length === 0) toast("You can't delete nothing");
                else handleDelete();
              }}
            >
              Delete
            </div>
            <label
              htmlFor={orderList.length >= 6 ? "my-drawer-5" : undefined}
              className="drawer-button"
              onClick={() => {
                if (orderList.length < 6)
                  toast("You need a minimum of 6 employees to order");
              }}
            >
              <div className="bg-bg rounded-full text-green-500 px-6  py-2 cursor-pointer hover:bg-green-500 duration-300 hover:text-bg flex items-center gap-2">
                <p>Order</p>
                <FaArrowRight size={10} />
              </div>
            </label>
          </div>
          <div className="flex sm:items-center justify-between flex-col sm:flex-row w-full mb-8">
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
            <div className="gap-2 hidden md:flex">
              {/* <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold tracking-wide text-fg/60 transition-all duration-150 bg-button-bg cursor-pointer border border-fg-2/4">
                <FaCreditCard size={15} />
                Order Cards
              </button> */}
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold tracking-wide text-fg/60 transition-all duration-150 bg-button-bg cursor-pointer border border-fg-2/4"
                onClick={() => {
                  document.getElementById("my_modal_9").showModal();
                }}
              >
                <IoMdAdd size={15} />
                Add an Employee
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold tracking-wide text-fg/60 transition-all duration-150 bg-button-bg cursor-pointer border border-fg-2/4"
                onClick={() => {
                  document.getElementById("my_modal_10").showModal();
                }}
              >
                <IoMdAdd size={15} />
                Add Bulk Employees Data
              </button>
            </div>
          </div>
          <div className="w-full flex justify-between items-center mb-2">
            <button
              className={`${isOrderTrig ? "bg-fg text-bg" : "bg-button-bg text-fg/60"} duration-300 px-2 py-1 rounded-xl border border-fg-2/4 cursor-pointer flex items-center gap-2 min-h-9`}
              onClick={() => {
                setIsOrderTrig(!isOrderTrig);
                if (!isOrderTrig) {
                  document.querySelectorAll(".order_class").forEach((box) => {
                    box.checked = false;
                  });
                  setOrderList([]);
                }
              }}
            >
              <IoIosCheckbox />
              <p className="hidden sm:block">Select multiple</p>
            </button>
            <div className="flex items-center gap-2 sm:max-w-2/3">
              <div
                className={`dropdown  ${isMobile ? "dropdown-start" : "dropdown-end"}`}
              >
                <div
                  tabIndex={0}
                  role="button"
                  className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] duration-150 text-white/20 bg-bg-2 hover:bg-bg-2/80"
                >
                  <FaFilter size={14} />
                  <p className="">...department</p>
                </div>
                <ul
                  tabIndex="-1"
                  className="dropdown-content menu rounded-box z-1 w-52 p-2 shadow-sm bg-bg-2"
                >
                  {departmentList.map((dep) => {
                    return (
                      <li
                        key={dep}
                        onClick={() => {
                          setSelectedDep(dep);
                        }}
                      >
                        <a>{dep}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="relative w-full max-w-sm">
                <BiSearchAlt
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#444" }}
                />
                <input
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Search…"
                  className="pl-7 pr-3 py-1.5 rounded-lg text-[12px] transition-all duration-150 bg-white/5 focus:bg-white/10 focus:outline-none border border-white/7 color-[#e8e0d4] w-full"
                />
              </div>
              {/* <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-all duration-150 text-[#666060] border border-white/7">
                <MdFileDownload size={14} />
                Export
              </button> */}
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden bg-bg-2 border border-white/5 min-h-[76vh] relative pb-15">
            {/* col headers */}
            <div className="relative">
              <div
                className={`grid place-items-center absolute left-5 top-1/2 -translate-y-1/2 ${!isOrderTrig && "hidden"} `}
              >
                <input
                  type="checkbox"
                  className="appearance-none order_class checked:bg-accent/75 border border-fg-2/10 rounded w-4 aspect-square cursor-pointer"
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    const checkboxes =
                      document.querySelectorAll(".order_class");
                    checkboxes.forEach((box) => {
                      box.checked = isChecked; // Use the property, not the attribute
                    });
                    if (isChecked) setOrderList(employees.map((e) => e.id));
                    else clearOrderList();

                    // console.log(orderList);
                  }}
                />
              </div>
              <div
                className="grid px-5 py-2 border-b border-white/5 "
                style={{
                  gridTemplateColumns: "1fr 1fr auto",
                }}
              >
                {["Employee", "Department", "Status"].map((h) => (
                  <span
                    key={h}
                    className={`text-[10px] tracking-widest uppercase text-[#444] 
                ${isOrderTrig && "ml-10"}
                ${isMobile && h === "Department" ? "hidden" : ""}
                ${isMobile && h === "Status" ? "flex justify-end" : ""}
                `}
                  >
                    {h}
                  </span>
                ))}
              </div>
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
              filtered
                .filter(
                  (emp) =>
                    selectedDep === "All" ||
                    emp.department.toString().toLowerCase() ===
                      selectedDep.toLowerCase(),
                )
                .map((emp, i) => (
                  <div className="relative" key={emp.id}>
                    <div
                      className={`grid place-items-center absolute left-5 top-1/2 -translate-y-1/2 ${!isOrderTrig && "hidden"}`}
                    >
                      <input
                        type="checkbox"
                        id={emp.id}
                        className="appearance-none order_class checked:bg-accent border border-fg-2/10 rounded w-4 aspect-square cursor-pointer"
                        onChange={(e) => {
                          if (e.target.checked) {
                            addOrderItem(emp.id);
                          } else {
                            removeOrderItem(emp.id);
                          }
                        }}
                      />
                    </div>
                    <div
                      className={`row-hover grid items-center pr-5 py-3 cursor-pointer transition-colors duration-100 ${isOrderTrig ? "ml-15" : "pl-5"}`}
                      style={{
                        gridTemplateColumns: "1fr 1fr 40px",
                        borderBottom:
                          i < filtered.length - 1
                            ? "1px solid rgba(255,255,255,0.04)"
                            : "none",
                      }}
                      onClick={() => {
                        setSelectedEmployee(emp);
                        document.getElementById("my_modal_5").showModal();
                      }}
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
              className="px-5 py-3 flex items-center justify-between bottom-1 absolute w-full"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="text-[11px]" style={{ color: "#555" }}>
                Showing{" "}
                {
                  filtered.filter(
                    (emp) =>
                      selectedDep === "All" ||
                      emp.department.toString().toLowerCase() ===
                        selectedDep.toLowerCase(),
                  ).length
                }{" "}
                of {employees.length}
              </span>
              {/* <button
            className="text-[11px] tracking-widest uppercase font-semibold hover:opacity-70 transition-opacity"
            style={{ color: "#d4b483" }}
          >
            View all →
          </button> */}
            </div>
            <div className="w-screen absolute">
              <AddEmployeeModal />
            </div>
            <div className="w-screen absolute">
              <EmployeeEditModal />
            </div>
            <div className="w-screen absolute">
              <BulkModal />
            </div>
          </div>
          <div
            className={`fab md:hidden bottom-10 right-10 ${isOrderTrig && "hidden"}`}
          >
            <div
              tabIndex="0"
              role="button"
              className="btn btn-lg btn-circle bg-accent text-bg-2 w-17 h-17"
            >
              <FaPlus size={20} />
            </div>

            <div className="fab-close">
              <span className="btn btn-lg btn-circle bg-red-500 w-17 h-17">
                ✕
              </span>
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
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-5"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <ul className="menu bg-base-200 min-h-full w-120 p-4 pt-22">
          {/* Sidebar content here */}
          <h1 className="text-lg font-bold mb-4">Select a Card Design</h1>

          <div
            className={`w-full aspect-video bg-fg-2 rounded-xl mb-2 relative group hover:scale-102 duration-200 cursor-pointer bg-cover overflow-hidden`}
            style={{
              backgroundImage: `url(${marketplace})`,
            }}
            onClick={() => navigate("/order/marketplace")}
          >
            <div className="absolute inset-0 bg-black group-hover:opacity-70 duration-200 opacity-0"></div>
            <p className="absolute bottom-11/20 w-full text-center text-fg opacity-0 group-hover:bottom-1/2 group-hover:translate-y-1/2 group-hover:opacity-100 duration-200">
              Go to the Design Marketplace
            </p>
          </div>
          <div
            className={`w-full aspect-video bg-fg-2 rounded-xl mb-2 relative group hover:scale-102 duration-200 cursor-pointer bg-cover bg-center overflow-hidden`}
            style={{
              backgroundImage: `url(${custom})`,
            }}
            onClick={() => navigate("/order/custom")}
          >
            <div className="absolute inset-0 bg-black group-hover:opacity-70 duration-200 opacity-0"></div>
            <p className="absolute bottom-11/20 w-full text-center text-fg opacity-0 group-hover:bottom-1/2 group-hover:translate-y-1/2 group-hover:opacity-100 duration-200 ">
              Submit a Custom Design
            </p>
          </div>
          <div
            className={`w-full aspect-video bg-[#c6c6c6] rounded-xl mb-9 relative group hover:scale-102 duration-200 cursor-pointer bg-cover overflow-hidden`}
            onClick={() => navigate("/order/blank")}
          >
            <p className="absolute bottom-11/20 w-full text-center text-bg opacity-0 group-hover:bottom-1/2 group-hover:translate-y-1/2 group-hover:opacity-100 duration-200">
              Order a Blank Card
            </p>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Employee;
