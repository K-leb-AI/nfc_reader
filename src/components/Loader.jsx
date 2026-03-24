import { PiSpinner } from "react-icons/pi";
const Loader = () => {
  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center sm:p-6 text-white flex-col gap-4">
      <PiSpinner className="animate-spin" size={40} />
      <p className="mt-4 text-foreground">Loading...</p>
    </div>
  );
};

export default Loader;
