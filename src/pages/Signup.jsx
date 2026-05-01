import { useState, useRef } from "react";
import Logo from "../components/Logo";
import { FaGoogle } from "react-icons/fa";
import { supabase } from "../../superbaseClient";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import { PiSpinner } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    firm_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const navigate = useNavigate();
  const confirmPasswordRef = useRef();
  const passwordRef = useRef();
  const [errors, setErrors] = useState();
  const [passwordReveal, setPasswordReveal] = useState(false);
  const [confirmPasswordReveal, setConfirmPasswordReveal] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^.{8,}$/;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    if (
      e.target.name === "confirm_password" &&
      passwordRef.current.value !== confirmPasswordRef.current.value
    ) {
      console.log(formData.password, confirmPasswordRef.current.value);
      setErrors((prev) => ({
        ...prev,
        confirmation_error: "Passwords do not match",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        confirmation_error: "",
      }));
    }
    if (e.target.name === "email" && !emailRegex.test(e.target.value)) {
      setErrors((prev) => ({
        ...prev,
        email_error: "Please enter a valid email address",
      }));
    } else if (e.target.name === "email") {
      setErrors((prev) => ({
        ...prev,
        email_error: "",
      }));
    }

    if (e.target.name === "password" && !passwordRegex.test(e.target.value)) {
      setErrors((prev) => ({
        ...prev,
        password_error: "Password must be at least 8 characters long",
      }));
    } else if (e.target.name === "password") {
      setErrors((prev) => ({
        ...prev,
        password_error: "",
      }));
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      errors?.confirmation_error ||
      errors?.email_error ||
      errors?.password_error
    ) {
      return toast.error(
        "Please fix the errors in the form before submitting.",
      );
    }

    if (
      !formData.firm_name ||
      !formData.email ||
      !formData.password ||
      !formData.confirm_password
    ) {
      return toast.error("Please fill in all the fields before submitting.");
    }
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            display_name: formData.firm_name,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        throw new Error(error.message);
      } else {
        setFormData({
          firm_name: "",
          email: "",
          password: "",
          confirm_password: "",
        });
        toast.success("Signup successful!");
        navigate("/onboarding");
      }
    } catch (error) {
      console.log("Error Signing up: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const url =
    import.meta.env.VITE_STATUS === "production"
      ? import.meta.env.VITE_BASE_URL
      : window.location.origin;

  const handleGoogleSignup = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${url}/onboarding`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log("Google signup successful: ", data);
    } catch (error) {
      console.log("Error signing in with Google: ", error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="mb-6">
        <Logo />
      </div>
      <h1 className="font-bold text-4xl">Create an account with us</h1>
      <h1 className="mb-10 text-accent text-center">
        It'll only take a couple of minutes.
      </h1>
      <div className="flex flex-col gap-2 w-110 sm:120">
        <input
          type="text"
          name="firm_name"
          className="bg-bg-2 border border-white/6 placeholder:text-[#888]/65 rounded-2xl px-5 py-4 focus:outline-none text-white w-full"
          placeholder="Your firm's name"
          value={formData.firm_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="email"
          className="bg-bg-2 border border-white/6 placeholder:text-[#888]/65 rounded-2xl px-5 py-4 focus:outline-none text-white w-full"
          placeholder="Admin email address (e.g. admin@yourcompany.com)"
          value={formData.email}
          onChange={handleChange}
        />
        <div className="relative">
          <input
            ref={passwordRef}
            type={passwordReveal ? "text" : "password"}
            className="bg-bg-2 border border-white/6 placeholder:text-[#888]/65 rounded-2xl px-5 py-4 focus:outline-none text-white w-full"
            placeholder="Select a Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/65"
            onClick={() => setPasswordReveal(!passwordReveal)}
          >
            {passwordReveal ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="relative">
          <input
            ref={confirmPasswordRef}
            type={confirmPasswordReveal ? "text" : "password"}
            className="bg-bg-2 border border-white/6 placeholder:text-[#888]/65 rounded-2xl px-5 py-4 focus:outline-none text-white w-full"
            placeholder="Confirm Password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/65"
            onClick={() => setConfirmPasswordReveal(!confirmPasswordReveal)}
          >
            {confirmPasswordReveal ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {errors && (
          <>
            <p className="text-red-400">{errors.confirmation_error}</p>
            <p className="text-red-400">{errors.password_error}</p>
            <p className="text-red-400">{errors.email_error}</p>
          </>
        )}
        <button
          type="submit"
          className="bg-accent text-bg duration-300 hover:bg-accent/90 py-4 rounded-2xl transition-colors cursor-pointer"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {!isSubmitting ? (
            "Create Account"
          ) : (
            <div className="flex items-center justify-center gap-1">
              <PiSpinner className="animate-spin" size={17} />
              Creating account...
            </div>
          )}
        </button>
        <div className="flex w-full items-center gap-3 mt-5">
          <div className="w-full h-0.5 bg-white/10 rounded-full"></div>
          <p className="text-white/65 flex justify-center w-fit">OR</p>
          <div className="w-full h-0.5 bg-white/10 rounded-full"></div>
        </div>
        <button
          type="submit"
          className="bg-[#292929] text-white duration-300 hover:bg-[#383838] py-4 rounded-2xl transition-colors cursor-pointer mt-5 flex items-center justify-center gap-2"
          onClick={handleGoogleSignup}
        >
          <FaGoogle />
          Signup with Google
        </button>
      </div>
      <div className="mt-4 text-fg/40">
        Already have an account?{" "}
        <span
          className="underline text-accent cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </div>
    </div>
  );
};

export default Signup;
