import { SiAuthelia } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const Unauthenticated = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 sm:p-6 text-white">
      <div className="flex flex-col items-center">
        <SiAuthelia size={70} className="text-accent" />
        <p className="font-bold text-5xl mt-10">401</p>
        <p className="mt-5 opacity-60 text-xl">
          You are not authenticated to access this page
        </p>
        <div className="flex gap-2">
          <button
            className="px-8 py-3 rounded-2xl cursor-pointer hover:opacity-85 duration-300 bg-white text-black mt-5"
            onClick={() => navigate("/")}
          >
            Go Home
          </button>
          <button
            className="px-8 py-3 rounded-2xl cursor-pointer hover:opacity-85 duration-300 bg-accent mt-5 text-bg-2"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthenticated;
