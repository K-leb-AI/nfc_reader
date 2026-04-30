import { DetailItem } from "./detailItem";
import { PhoneIcon, MailIcon } from "./icons";
import { formatDate } from "../utils";
import { FaLinkedinIn } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EmployeeCard = (props) => {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      <h1 className="text-xl sm:text-[2rem] mt-15 text-white font-semibold mb-6">
        Personal Details
      </h1>

      <div className="bg-bg-2 rounded-3xl w-full sm:max-w-none sm:w-auto flex flex-col sm:flex-row gap-0 sm:gap-0 overflow-hidden">
        {/* ── Left column: Photo + actions ── */}
        <div className="flex flex-col sm:w-70 md:w-90 shrink-0">
          {/* Photo */}
          <div className="relative overflow-hidden h-80 sm:min-h-90">
            <img
              src={props.employee.img_url}
              alt={props.employee.name}
              className="w-full h-full object-cover object-center"
            />
            {/* vignette */}
            <div className="absolute inset-0 bg-linear-to-t from-bg-2/80 via-transparent to-transparent" />

            {/* Status badge */}

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
              {
                icon: <PhoneIcon />,
                link: `tel:${props.employee.phone}`,
              },
              {
                icon: <FaWhatsapp />,
                link: `https://wa.me/+233${props.employee.whatsapp}`,
              },
              {
                icon: <FaLinkedinIn />,
                link: `https://${props.employee.linkedin}`,
              },
              {
                icon: <MailIcon />,
                link: `mailto:${props.employee.email}`,
              },
            ].map(({ icon, link }, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                className="icon-btn w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/6 flex items-center justify-center text-[#888] transition-all duration-150"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px bg-white/6 self-stretch" />
        <div className="sm:hidden h-px bg-white/6 mx-5" />

        {/* ── Right column: Details ── */}
        <div className="flex flex-col flex-1 px-5 sm:px-7 py-5 sm:py-6 min-w-0 relative">
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
            {/* <DetailItem label="Level" value={props.employee.level} /> */}
            {/* <DetailItem label="Manager" value={props.employee.manager} /> */}
            <DetailItem label="City" value={props.employee.city} />
            {/* <DetailItem
              label="Account Name"
              value={props.employee.account_name}
            /> */}
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

          <span
            className={`absolute top-4 right-4 text-[10px] tracking-widest uppercase font-semibold px-4 py-2 rounded-full text-white ${
              props.employee.is_active ? " bg-[#1f9f50]" : "bg-[#c41f1f]"
            }`}
          >
            {props.employee.is_active ? "Active" : "Inactive"}
          </span>
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
