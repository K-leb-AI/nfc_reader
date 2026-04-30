import { useState, useMemo, useEffect } from "react";
import Logo from "../components/Logo";
import Select from "react-select";
import countryList from "react-select-country-list";
import ImageUpload from "../components/ImageUpload";
import { useAuthStore } from "../stores/authStore";
import Unauthenticated from "../components/Unauthenticated";
import Loader from "../components/Loader";
import { supabase } from "../../superbaseClient";
import toast from "react-hot-toast";
import { PiSpinner } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { HiLightningBolt } from "react-icons/hi";

const Onboarding = () => {
  const [image, setImage] = useState(null);
  const [value, setValue] = useState("");
  const options = useMemo(() => countryList().getData(), []);
  const { user, auth_loading, setCompanyProfile } = useAuthStore();
  const navigate = useNavigate();
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState({
    //from signup page
    firm_name: user?.user_metadata.name || "",
    email: user?.email || "",

    // On this page
    website_url: "",
    contact_number: "",
    google_maps_url: "",
    address: "",
    country: "",
    logo_url: "",
    is_active: true,
  });
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "var(--color-bg-2)", // matches bg-bg-2
      border: "1px solid rgba(255, 255, 255, 0.06)", // matches border-white/6
      borderRadius: "1rem", // matches rounded-2xl
      padding: "0 s1.25rem", // matches px-5 py-4 (adjusted for internal padding)
      color: "white", // matches text-white
      width: "100%", // matches w-full
      boxShadow: "none",
      "&:hover": {
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgba(136, 136, 136, 0.65)", // matches placeholder:text-[#888]/65
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "var(--color-bg-2)", // matches bg-bg-2
      borderRadius: "1rem",
      border: "1px solid rgba(255, 255, 255, 0.06)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "rgba(255, 255, 255, 0.05)"
        : "transparent",
      color: "white",
      "&:active": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      },
    }),
  };
  const changeHandler = (value) => {
    setValue(value);
    setFormData((prev) => ({
      ...prev,
      country: value.label,
    }));
  };
  const uploadImage = async () => {
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("company_logo")
        .upload(`${Date.now()}_${image.name}`, image, {
          contentType: image.type,
        });

      if (uploadError) {
        toast("Error uploading logo...");
        throw new Error(
          `Error uploading thumbnail image: ${uploadError.message}`,
        );
      } else {
        console.log("Image uploaded succesfully");
        return `${import.meta.env.VITE_SUPABASE_IMAGE_URL}/${uploadData.fullPath}`;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.website_url ||
      !formData.contact_number ||
      !formData.google_maps_url ||
      !formData.address ||
      !formData.country
    ) {
      return toast.error("Please fill in all required fields");
    }
    setIsOnboarding(true);
    try {
      const logo_url = await uploadImage();
      const { data: onboardData, error: onboardError } = await supabase
        .from("company")
        .insert({ ...formData, logo_url })
        .select("*");

      if (onboardError) {
        console.log(onboardError);
        throw new Error(onboardError);
      } else {
        console.log(onboardData);
        toast.success(`Welcome, ${user.user_metadata.name}`);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Error onboarding: ", error.message);
      toast(error.message);
    } finally {
      setIsOnboarding(false);
    }
  };
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (!user?.id) return;
    const getCompanyData = async () => {
      setIsFetching(true);
      try {
        const { data: companyData, error } = await supabase
          .from("company")
          .select("*")
          .eq("auth_id", user.id)
          .single();
        if (error) throw error;
        // setCompanyProfile(companyData);
        else {
          navigate("/dashboard");
          toast("You're already onboarded");
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setIsFetching(false);
      }
    };

    getCompanyData();
  }, [user?.id]);

  if (auth_loading || isFetching) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  } else if (!user) {
    return <Unauthenticated />;
  } else
    return (
      <div className="w-full min-h-screen py-20 flex flex-col items-center justify-center">
        <div className="mb-6">
          <Logo />
        </div>
        <h1 className="font-bold text-4xl">Onboard with us</h1>
        <h1 className="mb-5 text-accent text-center">
          You can change these details later in your account settings.
        </h1>

        <div
          className={`w-110 sm:120 flex px-6 py-4 items-center bg-bg-2/50 mb-5 rounded-2xl gap-5 ${!user.user_metadata && "hidden"}`}
        >
          <img
            src={user.user_metadata.avatar_url}
            alt="User Avatar"
            className="rounded-full aspect-square w-15"
          />

          <div className="">
            <p className="text-white font-medium">{user.user_metadata.name}</p>
            <p className="text-[#888]/65">{user.email}</p>
          </div>
        </div>
        <form className="flex flex-col gap-2 w-110 sm:120">
          <input
            type="text"
            className="bg-bg-2 border border-white/6 placeholder:text-[#888]/65 rounded-2xl px-5 py-4 focus:outline-none text-white w-full"
            placeholder="Official website url (e.g. https://www.yourcompany.com)"
            name="website_url"
            value={formData.website_url}
            onChange={handleChange}
          />
          <input
            type="text"
            className="bg-bg-2 border border-white/6 placeholder:text-[#888]/65 rounded-2xl px-5 py-4 focus:outline-none text-white w-full"
            placeholder="Official company contact number"
            required
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
          />
          <input
            type="text"
            className="bg-bg-2 border border-white/6 placeholder:text-[#888]/65 rounded-2xl px-5 py-4 focus:outline-none text-white w-full"
            placeholder="Enter a Google Maps URL of your company location (e.g. https://maps.google.com/?q=yourcompanylocation)"
            required
            name="google_maps_url"
            value={formData.google_maps_url}
            onChange={handleChange}
          />
          <input
            type="text"
            className="bg-bg-2 border border-white/6 placeholder:text-[#888]/65 rounded-2xl px-5 py-4 focus:outline-none text-white w-full"
            placeholder="Address (e.g. 123 Konongo Street, Konongo, Ghana)"
            required
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <Select
            options={options}
            value={value}
            onChange={changeHandler}
            styles={customStyles}
            placeholder="Select your country"
            required
          />
          <div className="aspect-2/1 max-h-55">
            <ImageUpload setImage={setImage} />
          </div>
          <button
            type="submit"
            className="bg-accent text-bg duration-300 hover:bg-accent/90 py-4 rounded-2xl transition-colors cursor-pointer mt-10"
            onClick={handleSubmit}
            disabled={isOnboarding}
          >
            {!isOnboarding ? (
              "Onboard"
            ) : (
              <div className="flex items-center justify-center gap-1">
                <PiSpinner className="animate-spin" size={17} />
                Onboarding...
              </div>
            )}
          </button>
        </form>
      </div>
    );
};

export default Onboarding;
