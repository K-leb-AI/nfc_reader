import { useState, useEffect } from "react";
import { supabase } from "../../superbaseClient";
import Loader from "../components/Loader";
// import { employee } from "../data";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { NotFound } from "../components/NotFound";
import { HiLightningBolt } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import EmployeeCard from "../components/EmployeeCard";
import CompanyDetails from "../components/CompanyDetails";

export default function DisplayPage() {
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [employee, setEmployee] = useState();
  const [company, setCompany] = useState();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchId, setSearchId] = useState("");

  const copy = () => {
    navigator.clipboard.writeText(emp.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearch = () => {
    // Implementation for search functionality
    navigate(`/employee/${searchId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: employeeData, error: employeeError } = await supabase
          .from("employee")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (employeeError) {
          return toast.error(
            `Error fetching employee data: `,
            employeeError.message,
          );
        }
        setEmployee(employeeData);

        const { data: companyData, error: companyError } = await supabase
          .from("company")
          .select("*")
          .eq("id", employeeData.company_id)
          .maybeSingle();

        if (companyError) {
          return toast.error(
            `Error fetching company data: `,
            companyError.message,
          );
        }
        setCompany(companyData);

        console.log(employeeData, companyData);
        if (employeeData && companyData)
          toast.success(`Fetched data successfully`);
      } catch (e) {
        console.log(`Error fetching data: `, e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <Loader />;
  }
  return (
    <div className=" bg-[#1c1c1e] flex flex-col items-center py-10 px-4 min-h-screen justify-center">
      <div className="flex gap-2 text-3xl text-white items-center mb-12 font-bold">
        <HiLightningBolt size={25} className="text-[#d4b483]" />
        <p>
          Abankese <span className="font-light text-[#d4b483]">Axis</span>
        </p>
      </div>
      {!employee && (
        <>
          <NotFound employeeId={id} />
        </>
      )}
      {employee && (
        <>
          <div className="grid grid-cols-1">
            <div className="flex gap-4">
              <input
                type="text"
                className="w-full bg-[#242424] border border-white/6 placeholder:text-[#888] rounded-2xl px-5 py-4 text-sm text-white "
                placeholder="Enter employee ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <button
                className="bg-[#d4b483] text-[#1c1c1e] px-8 py-5 rounded-2xl w-1/4 font-semibold hover:bg-[#c4a473] transition-colors"
                onClick={handleSearch}
              >
                <FaSearch className="inline-block sm:hidden" size={20} />
                <p className="hidden sm:block">Search Id</p>
              </button>
            </div>
            <CompanyDetails company={company} />
            <EmployeeCard employee={employee} copy={copy} copied={copied} />
          </div>
        </>
      )}
    </div>
  );
}
