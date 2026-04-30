import NfcDesign from "../../components/nfcDesign";
import MarketplaceBanner from "../../components/MarketplaceBanner";
import { supabase } from "../../../superbaseClient";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { useOrderList } from "../../stores/utilStores";
import ColourPicker from "../../components/ColourPicker";
import Toggle from "../../components/Toggle";
import { useRef } from "react";
import emailjs from "@emailjs/browser";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";

const Marketplace = () => {
  const [designs, setDesigns] = useState([]);
  const [isDesFetching, setIsDesFetching] = useState(true);
  const orderList = useOrderList((state) => state.orderList);
  const clearOrderList = useOrderList((state) => state.clearOrderList);
  const [selectedDesign, setSelectedDesign] = useState({});
  const [colours, setColours] = useState({
    primary: "#ffffff",
    secondary: "#000000",
    isPrimary: true,
  });
  const [isSelecting, setIsSelecting] = useState(false);
  const [isImgBased, setIsImgBased] = useState(true);
  const { company_profile } = useAuthStore();
  const [specifications, setSpecifications] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsRequesting(true);
    try {
      const { data, error } = await supabase
        .from("employee")
        .select()
        .in("id", orderList);

      const orderListHtml = data
        .map(
          (emp) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px 0;">
        <div style="font-weight: bold; color: #111827;">${emp.name}</div>
        <div style="font-size: 12px; color: #6b7280;">${emp.role} • ${emp.department}</div>
      </td>
      <td style="padding: 10px 0; text-align: right; font-size: 12px; color: #4f46e5;">
        ${emp.email}
      </td>
    </tr>
  `,
        )
        .join("");

      console.log(orderListHtml);

      if (error) throw error;
      const templateParams = {
        company_name: company_profile?.firm_name,
        order_list_table: orderListHtml,
        primary: colours.primary,
        secondary: colours.secondary,
        design_name: selectedDesign.design_name,
        design_url: selectedDesign.img_url,
        specifications: specifications,
        total_price: (
          (selectedDesign.price || 0) + (orderList.length * 25 || 0)
        ).toFixed(2),
        email: import.meta.env.VITE_EMAIL_ADDRESS,
      };

      emailjs
        .send(
          import.meta.env.VITE_SERVICE_ID, // Added .env
          import.meta.env.VITE_TEMPLATE_ID, // Added .env
          templateParams, // Use .send() with the object
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY, // Added .env
        )
        .then(
          () => {
            toast.success("Order placed successfully!");
          },
          (error) => {
            console.log("FAILED...", error);
            toast.error("Failed to send order.");
          },
        );
    } catch (e) {
      console.log("Error Sending Email: ", e.message);
    } finally {
      setIsRequesting(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (orderList.length === 0) {
      navigate("/dashboard/employees");
      return;
    }
    const getDesigns = async () => {
      try {
        const { data, error } = await supabase.from("card_designs").select("*");
        if (error) throw error;
        setDesigns(data);
      } catch (error) {
        console.log("Error fetching designs: ", error);
        toast(error.message);
      } finally {
        setIsDesFetching(false);
      }
    };
    getDesigns();
  }, []);

  const handleSendOrder = async () => {};
  if (isDesFetching) return <Loader />;

  return (
    // Extra bottom padding so the floating Cancel button doesn't overlap content
    <div className="min-h-screen pb-24 relative aspect-square">
      <div
        className="absolute inset-0 z-0"
        onClick={() => {
          if (isSelecting) setIsSelecting(false);
        }}
      ></div>
      {/* ── Banner ── */}
      <div className="w-full h-[30vh] sm:h-[40vh] bg-fg-2">
        <MarketplaceBanner />
      </div>

      {/* ── Main content ── */}
      <div className="w-full mt-10 px-4 sm:px-6 lg:px-8 max-w-360 mx-auto flex flex-col lg:flex-row gap-8 relative">
        {/* ── Design grid ── */}
        <div className="flex-1">
          <div className="mb-10 flex gap-6 items-center">
            <Toggle setIsImgBased={setIsImgBased} isImgBased={isImgBased} />
            <div className="">
              <p className="text-lg font-bold">
                {isImgBased
                  ? "Image-Based Card Designs"
                  : "Text-Based Card Designs"}
              </p>
              <p className="text-xs text-fg/30">
                {isImgBased
                  ? "Select from a pool of designs that include employee images on their cards."
                  : "Select from a our non-image text-based designs."}
              </p>
            </div>
          </div>
          <div className=" grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {designs
              .filter((des) => des.is_img_based === isImgBased)
              .map((des, index) => (
                <NfcDesign
                  design={des}
                  key={index}
                  setSelectedDesign={setSelectedDesign}
                  selectedDesign={selectedDesign}
                />
              ))}
          </div>
        </div>

        <div className="lg:w-80 xl:w-96 lg:sticky lg:top-8 lg:self-start rounded-xl fixed bottom-2 inset-x-3 bg-bg-2 px-4 py-6 lg:p-0 lg:bg-bg ">
          <h1 className="font-bold mb-5 text-2xl">Prefered Aesthetics</h1>
          <div className="flex items-center gap-6 relative mb-5">
            <div className="flex flex-col w-full gap-2 items-center">
              <div
                className={`flex w-full h-10 rounded-xl border-4 border-bg-2/20 cursor-pointer b`}
                style={{
                  backgroundColor: `${colours.primary}`,
                }}
                onClick={() => {
                  setIsSelecting(!isSelecting);
                  setColours((prev) => ({
                    ...prev,
                    isPrimary: true,
                  }));
                }}
              ></div>
              <p className="text-fg/50 ">Primary Color</p>
            </div>
            <div className="flex flex-col w-full gap-2 items-center">
              <div
                className="flex w-full h-10 rounded-xl border-4 border-bg-2/20 cursor-pointer"
                style={{
                  backgroundColor: `${colours.secondary}`,
                }}
                onClick={() => {
                  setIsSelecting(!isSelecting);
                  setColours((prev) => ({
                    ...prev,
                    isPrimary: false,
                  }));
                }}
              ></div>
              <p className="text-fg/50">Secondary Color</p>
            </div>
            <div
              className={`absolute -bottom-full translate-y-7/10 ${colours.isPrimary ? "left-0" : "right-0"} ${!isSelecting && "hidden"}`}
            >
              <ColourPicker colours={colours} setColours={setColours} />
            </div>
          </div>
          <textarea
            name="specs"
            className="bg-bg-2 rounded-2xl w-full min-h-28 py-4 px-6 placeholder:text-fg/30 focus:outline-none resize-none mb-20 hidden sm:block"
            placeholder="Enter any specifications for our consideration"
            value={specifications}
            onChange={(e) => setSpecifications(e.target.value)}
          />

          <h1 className="font-bold mb-6 text-2xl">Order Details</h1>
          <div className="flex justify-between text-fg-2/50 mb-3">
            <p>NFC Cards ({[...orderList].length})</p>
            <p>GH₵ {(orderList.length * 25).toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-fg-2/50 mb-3">
            <p>Selected Card Design</p>
            <p>GH₵ {selectedDesign.price || 0}</p>
          </div>

          <div className="flex justify-between mt-8 mb-5 font-medium">
            <p>Total</p>
            <p>
              GH₵{" "}
              {(
                (selectedDesign.price || 0) + (orderList.length * 25 || 0)
              ).toFixed(2)}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              className="w-full bg-accent hover:bg-accent/90 duration-200 text-bg-2 py-3 rounded-full cursor-pointer"
              onClick={sendEmail}
            >
              {isRequesting ? "...Placing Order" : "Place Order"}
            </button>
            <button
              className="bg-red-500 hover:bg-red-500/80 duration-200 text-white rounded-full py-2 cursor-pointer w-full"
              onClick={() => {
                clearOrderList();
                navigate("/dashboard/employees");
              }}
            >
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
