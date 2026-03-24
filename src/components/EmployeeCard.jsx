import { DetailItem } from "./detailItem";
import { PhoneIcon, ChatIcon, LinkIcon, MailIcon } from "./icons";
import { formatDate } from "../utils";

const EmployeeCard = (props) => {
  return (
    <div className="w-full">
      <h1 className="text-xl sm:text-[2rem] mt-15 text-white font-semibold mb-6">
        Personal Details
      </h1>

      <div className="bg-[#242424] rounded-3xl w-full sm:max-w-none sm:w-auto flex flex-col sm:flex-row gap-0 sm:gap-0 overflow-hidden">
        {/* ── Left column: Photo + actions ── */}
        <div className="flex flex-col sm:w-70 md:w-90 shrink-0">
          {/* Photo */}
          <div className="relative overflow-hidden h-70 sm:h-85 md:h-full sm:min-h-105">
            <img
              src={props.employee.img_url}
              alt={props.employee.name}
              className="w-full h-full object-cover object-top"
            />
            {/* vignette */}
            <div className="absolute inset-0 bg-linear-to-t from-[#242424]/80 via-transparent to-transparent" />

            {/* Status badge */}
            <span
              className={`absolute top-4 left-4 text-[10px] tracking-widest uppercase font-semibold px-2 py-1 rounded-full text-white ${
                props.employee.is_active ? " bg-[#018c50]" : "bg-[#c41f1f]"
              }`}
            >
              {props.employee.is_active ? "Active" : "Inactive"}
            </span>

            {/* Name overlay */}
            <div className="absolute bottom-5 left-4">
              <h1 className="display text-[2.2rem] sm:text-[2.6rem] text-white leading-[0.92]">
                {props.employee.name}
              </h1>
              <span className="text-[#cdcdcd] text-sm tracking-widest">
                {props.employee.role}
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
                action: props.copy,
                title: props.copied ? "Copied!" : "Copy email",
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
            <DetailItem label="Name" value={props.employee.name} />
            <DetailItem label="Phone" value={props.employee.phone} />
            <DetailItem
              label="Email"
              value={props.employee.email.split("@")[0]}
            />
            <DetailItem label="Department" value={props.employee.department} />
            <DetailItem label="Job Title" value={props.employee.role} />
            <DetailItem label="Level" value={props.employee.level} />
            <DetailItem label="Manager" value={props.employee.manager} />
            <DetailItem label="City" value={props.employee.city} />
            <DetailItem
              label="Account Name"
              value={props.employee.account_name}
            />
            <DetailItem label="Contact ID" value={props.employee.id} accent />
          </div>

          {/* Member since */}
          <div className="px-5 py-3 rounded-2xl mt-8 flex items-center gap-3 bg-white/2">
            <span className="text-[10px] tracking-widest uppercase text-[#666060]">
              Member since
            </span>
            <span className="mono text-sm sm:text-base text-[#888]">
              {formatDate(props.employee.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Back button */}
      {/* <div className="mt-5">
        <button
          className="px-8 py-3 rounded-2xl cursor-pointer hover:opacity-85 duration-300 text-[#d4b483] w-full text-center"
          onClick={() => navigate("/")}
        >
          Go back to the Landing Page
        </button>
      </div> */}
    </div>
  );
};

export default EmployeeCard;
