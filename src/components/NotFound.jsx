import { useNavigate } from "react-router-dom";

const NotFound = (props) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center p-4 sm:p-6">
      <div className=" bg-[#242424] rounded-3xl w-full max-w-[320px] sm:max-w-100 overflow-hidden">
        {/* Ghost photo area */}
        <div className="relative h-50 bg-[#2c2c2f] flex items-center justify-center overflow-hidden">
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.035]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="hatch"
                width="12"
                height="12"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="12"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hatch)" />
          </svg>
          <div className="relative flex flex-col items-center gap-2 select-none">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-14 h-14 text-[#3a3a3a]"
            >
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
              <line x1="4" y1="4" x2="20" y2="20" stroke="#3a3a3a" />
            </svg>
          </div>
        </div>

        {/* Message body */}
        <div className="px-7 py-6">
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#555] font-medium block mb-1.5">
            Employee not found
          </span>
          <h2 className="display text-[2rem] text-[#e8e0d4] leading-none mb-3">
            No record exists
          </h2>
          <p className="text-[13px] text-[#555] leading-relaxed">
            {props.employeeId ? (
              <>
                ID{" "}
                <span className="mono text-[12px] text-[#888] bg-white/5 px-1.5 py-0.5 rounded">
                  {props.employeeId}
                </span>{" "}
                doesn't match any employee in the database.
              </>
            ) : (
              "The requested employee could not be found."
            )}
          </p>

          <div className="mt-6 pt-5 border-t border-white/6 flex gap-3">
            <button
              className="flex-1 py-2.5 text-[11px] tracking-[0.12em] uppercase font-medium rounded-xl bg-white/5 text-[#666] hover:bg-white/9 hover:text-[#e8e0d4] transition-all duration-150"
              onClick={() => {
                navigate(-1);
              }}
            >
              Go Back
            </button>
            <button className="flex-1 py-2.5 text-[11px] tracking-[0.12em] uppercase font-medium rounded-xl border border-[#d4b483]/20 bg-[#d4b483]/8 text-[#d4b483] hover:bg-[#d4b483]/15 transition-all duration-150">
              Search Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
