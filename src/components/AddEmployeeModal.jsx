import { useEffect, useState } from "react";
import { FiUser, FiMail, FiBriefcase, FiMapPin, FiPhone } from "react-icons/fi";
import { FaWhatsapp, FaLinkedinIn } from "react-icons/fa";
import { MdOutlineBusinessCenter } from "react-icons/md";
import ImageUpload from "./ImageUpload";
import { supabase } from "../../superbaseClient";
import toast from "react-hot-toast";
import Compressor from "compressorjs";
import { useEmpStore } from "../stores/employeeStore";
import { useAuthStore } from "../stores/authStore";

function Field({ label, icon, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase font-semibold text-[#666060]">
        <span className="text-[#555]">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3.5 py-2.5 rounded-xl text-[13px] transition-all duration-150 outline-none bg-white/4 border border-white/4 text-fg-2 focus:border-accent/66 placeholder:text-[#3a3a3a]"
    />
  );
}

const AddEmployeeModal = (props) => {
  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);
  const [imageReset, setImageReset] = useState(0);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const [isSaving, setIsSaving] = useState(false);
  const { company_profile } = useAuthStore();
  // Add this helper above the component

  const createEmployee = async () => {
    setIsSaving(true);
    const uploadImage = async () => {
      try {
        const publicUrl = await new Promise((resolve, reject) => {
          new Compressor(image, {
            quality: 0.5,
            maxWidth: 800,
            async success(result) {
              const fileName = `${Date.now()}_${image.name}`;
              const { data: uploadData, error: uploadError } =
                await supabase.storage
                  .from("employee_images")
                  .upload(fileName, result, {
                    contentType: result.type,
                  });

              if (uploadError) {
                toast("Error uploading avatar...");
                reject(
                  new Error(`Error uploading image: ${uploadError.message}`),
                );
                return;
              }

              console.log("Image uploaded successfully");
              const { data } = supabase.storage
                .from("employee_images")
                .getPublicUrl(uploadData.path);
              resolve(data.publicUrl);
            },
            error(err) {
              reject(err);
            },
          });
        });
        return publicUrl;
      } catch (error) {
        console.log(error);
        setForm({
          name: "",
          img_url: "",
          role: "",
          department: "",
          email: "",
          is_active: false,
          city: "",
          phone: "",
          whatsapp: "",
          linkedin: "",
        });
      }
    };

    try {
      if (
        !form.name ||
        !form.role ||
        !form.department ||
        !form.email ||
        !form.city ||
        !form.phone ||
        !form.whatsapp ||
        !form.linkedin
      ) {
        console.log(form);
        return toast.error("Please fill in all required fields");
      }

      const avatar_url = image && (await uploadImage());
      const { data, error } = await supabase.from("employee").insert({
        name: form.name,
        img_url: avatar_url || form.img_url,
        role: form.role,
        department: form.department,
        email: form.email,
        is_active: form.is_active,
        city: form.city,
        phone: form.phone,
        whatsapp: form.whatsapp,
        linkedin: form.linkedin,
        company_id: company_profile.id,
      });

      if (error) throw error;
      else toast.success("Saved Successfully!");
    } catch (error) {
      console.log("Error trying to save changes: ", error);
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <dialog
      id="my_modal_9"
      className="modal modal-bottom sm:modal-middle w-full border-dashed focus:outline-0"
    >
      <div className="modal-box bg-bg-2 rounded-2xl md:w-[66vw] max-w-300">
        <h3 className="font-bold text-xl mb-4">Add Employee</h3>
        <form className="flex flex-col gap-6 text-fg-2 w-full">
          <div className="grid sm:grid-cols-2 gap-6 grid-rows-1">
            <div className="row-span-1 min-h-55 max-h-65 overflow-hidden rounded-xl relative">
              <ImageUpload
                setImage={setImage}
                thumbnail={form.img_url}
                preview={form.img_url}
                reset={imageReset}
              />
            </div>
            <div className="grid-rows-3 grid grid-cols-2 gap-4">
              <Field
                label="Full Name"
                icon={<FiUser size={11} />}
                className="col-span-1 row-span-1"
              >
                <Input
                  value={form.name}
                  onChange={set("name")}
                  placeholder="e.g. Amara Osei-Bonsu"
                />
              </Field>
              <Field label="Role" icon={<FiBriefcase size={11} />}>
                <Input
                  value={form.role}
                  onChange={set("role")}
                  placeholder="e.g. Senior Designer"
                />
              </Field>
              <Field
                label="Department"
                icon={<MdOutlineBusinessCenter size={11} />}
              >
                <Input
                  value={form.department}
                  onChange={set("department")}
                  placeholder="e.g. Engineering"
                />
              </Field>
              <Field label="City" icon={<FiMapPin size={11} />}>
                <Input
                  value={form.city}
                  onChange={set("city")}
                  placeholder="e.g. Accra"
                />
              </Field>

              <Field label="Phone" icon={<FiPhone size={11} />}>
                <Input
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="+233 30 000 0000"
                />
              </Field>
              <Field label="WhatsApp" icon={<FaWhatsapp size={11} />}>
                <Input
                  value={form.whatsapp}
                  onChange={set("whatsapp")}
                  placeholder="+233 30 000 0000"
                />
              </Field>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Email" icon={<FiMail size={11} />}>
              <Input
                value={form.email}
                onChange={set("email")}
                placeholder="name@company.io"
                type="email"
              />
            </Field>

            <Field label="LinkedIn" icon={<FaLinkedinIn size={11} />}>
              <div className="flex items-center rounded-xl overflow-hidden border border-white/8">
                <span className="px-3 text-[12px] h-full flex items-center py-2.5 shrink-0 bg-white/3 text-[#555] border-r border-white/8">
                  linkedin.com/in/
                </span>
                <input
                  type="text"
                  value={
                    form.linkedin
                      ? String(form.linkedin).replace(
                          /.*linkedin\.com\/in\//i,
                          "",
                        )
                      : ""
                  }
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      linkedin: `linkedin.com/in/${e.target.value}`,
                    }))
                  }
                  placeholder="yourhandle"
                  className="flex-1 px-3 py-2.5 text-[13px] bg-transparent outline-none text-fg-2"
                />
              </div>
            </Field>
          </div>

          {/* ── Is Active toggle ── */}
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/3 border border-white/7 cursor-default">
            <div>
              <p className="text-[13px] font-medium text-fg-2">
                Active employee
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: "#555" }}>
                {form.is_active
                  ? "Visible on the platform"
                  : "Hidden from the platform"}
              </p>
            </div>

            <input
              type="checkbox"
              className={`toggle checked:text-accent bg-bg-2 "cursor-pointer" `}
              checked={form.is_active}
              onClick={() => {
                setForm((f) => ({ ...f, is_active: !f.is_active }));
              }}
            />
          </div>
        </form>
        <div className="modal-action ">
          <form method="dialog">
            <div className="flex gap-3 pt-1">
              <button
                className="bg-accent text-bg-2 px-5 py-2 rounded-xl cursor-pointer"
                onClick={createEmployee}
              >
                Create Employee
              </button>
              <button
                className="bg-red-500 text-white px-5 py-2 rounded-xl cursor-pointer"
                onClick={() => {
                  setForm({
                    name: "",
                    img_url: "",
                    role: "",
                    department: "",
                    email: "",
                    is_active: false,
                    city: "",
                    phone: "",
                    whatsapp: "",
                    linkedin: "",
                  });
                  setImage("");
                  setImageReset((n) => n + 1);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default AddEmployeeModal;
