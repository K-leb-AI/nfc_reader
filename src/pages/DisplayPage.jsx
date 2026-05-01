import { useState, useEffect, useRef } from "react";
import { supabase } from "../../superbaseClient";
import Loader from "../components/Loader";
// import { employee } from "../data";
import toast from "react-hot-toast";
import { data, useParams } from "react-router-dom";
import { NotFound } from "../components/NotFound";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import EmployeeCard from "../components/EmployeeCard";
import CompanyDetails from "../components/CompanyDetails";
import ProductsSection from "../components/ProductsSection";
import { _sampleProducts } from "../data";
import Logo from "../components/Logo";

export default function DisplayPage() {
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [employee, setEmployee] = useState();
  const [company, setCompany] = useState();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchId, setSearchId] = useState("");
  const hasLogged = useRef(false);

  const copy = () => {
    navigator.clipboard.writeText(employee.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearch = () => {
    // Implementation for search functionality
    navigate(`/employee/${searchId}`);
  };

  useEffect(() => {
    let ignore = false; // ← scoped to this effect run
    const fetchData = async () => {
      try {
        const { data: employeeData, error: employeeError } = await supabase
          .from("employee")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (employeeError || !employeeData) throw employeeError;

        setEmployee(employeeData);

        if (!ignore) {
          // const { data: activityLogData, error: activityLogError } =
          await supabase.from("activity_logs").insert({
            event_type: "card_tap",
            employee_id: employeeData.id,
            company_id: employeeData.company_id,
            actor: null,
            description_text: `${employeeData.name}'s card was tapped.`,
          });
        }

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

        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("company_id", companyData.id);

        if (productError) {
          console.log(`Error fetching product data: `, productError.message);
          return toast.error(
            `Error fetching product data: `,
            productError.message,
          );
        }
        setProducts(productData || []);

        if (employeeData && companyData)
          toast.success(`Fetched data successfully`);
      } catch (e) {
        console.log(`Error fetching data: `, e.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();
    return () => {
      ignore = true;
    };
  }, [id]);

  // useEffect(() => {
  //   if (isMounted.current) return;
  //   isMounted.current = true;

  //   console.log(`Entered`);
  //   console.log(employee);
  //   const recordCardTap = async () => {
  //     try {
  //       const { data, error } = await supabase
  //         .from("activity_logs")
  //         .insert({
  //           event_type: "card_tap",
  //           employee_id: employee.id,
  //           company_id: employee.company_id,
  //           actor: null,
  //           description_text: `${employee.name}'s card was tapped.`,
  //         })
  //         .select("*")
  //         .maybeSingle();
  //     } catch (e) {
  //       console.log(`Error recording card tap: `, e);
  //     }
  //   };
  //   if (employee) {
  //     recordCardTap();
  //   }
  // }, [employee]);

  if (loading) {
    return <Loader />;
  }
  return (
    <div className=" bg-bg flex flex-col items-center py-10 px-4 min-h-screen justify-center">
      <div className="mb-12">
        <Logo />
      </div>
      {!employee && (
        <>
          <NotFound employeeId={id} />
        </>
      )}
      {employee && (
        <>
          <div className="grid grid-cols-1">
            {/* <div className="flex gap-4">
              <input
                type="text"
                className="w-full bg-bg-2 border border-white/6 placeholder:text-[#888] rounded-2xl px-5 py-4 text-sm text-white "
                placeholder="Enter employee ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <button
                className="bg-accent text-bg px-8 py-5 rounded-2xl w-1/4 font-semibold hover:bg-[#c4a473] transition-colors"
                onClick={handleSearch}
              >
                <FaSearch className="inline-block sm:hidden" size={20} />
                <p className="hidden sm:block">Search Id</p>
              </button>
            </div> */}
            <CompanyDetails company={company} />
            <EmployeeCard employee={employee} copy={copy} copied={copied} />
            <ProductsSection products={products} />
          </div>
        </>
      )}
    </div>
  );
}
