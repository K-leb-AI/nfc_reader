import { SiQuantconnect } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const NoPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center p-4 sm:p-6 text-white">
      <div className="flex flex-col items-center">
        <SiQuantconnect size={70} className="text-[#d4b483]" />
        <p className="font-bold text-5xl mt-10">404</p>
        <p className="mt-5 opacity-60 text-xl">
          The page you're looking for does not exist
        </p>
        <button
          className="px-8 py-3 rounded-2xl cursor-pointer hover:opacity-85 duration-300 bg-white text-black mt-5"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NoPage;
