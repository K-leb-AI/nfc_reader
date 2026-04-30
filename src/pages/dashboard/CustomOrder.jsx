import { useState, useEffect } from "react";
import { useOrderList } from "../../stores/utilStores";
import ImageUpload from "../../components/ImageUpload";
import UploadDesign from "../../components/UploadDesign";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import emailjs from "@emailjs/browser";
import { supabase } from "../../../superbaseClient";
import toast from "react-hot-toast";
import { IoIosWarning } from "react-icons/io";

const CustomOrder = () => {
  const [specifications, setSpecifications] = useState();
  const clearOrderList = useOrderList((state) => state.clearOrderList);
  const orderList = useOrderList((state) => state.orderList);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState();
  const [preview, setPreview] = useState();
  const [image, setImage] = useState("");
  const { company_profile } = useAuthStore();

  const uploadImage = async () => {
    try {
      const fileName = `${Date.now()}_${image.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("custom_designs")
        .upload(fileName, image, {
          contentType: image.type,
        });
      if (uploadError) {
        toast("Error uploading avatar...");
        reject(new Error(`Error uploading image: ${uploadError.message}`));
        return;
      }
      return `${import.meta.env.VITE_SUPABASE_IMAGE_URL}/${uploadData.fullPath.replaceAll(" ", "%20")}`;
    } catch (error) {
      console.log(error);
    }
  };

  const sendEmail = async (e) => {
    setIsSubmitting(true);

    if (!image) {
      setIsSubmitting(false);
      return toast("Please upload your image file.");
    }
    try {
      const img_url = await uploadImage();
      const { data, error } = await supabase
        .from("employee")
        .select()
        .in("id", orderList);

      if (error) throw error;

      const order_list_table = data
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

      const templateParams = {
        company_name: company_profile?.firm_name,
        img_url,
        order_list_table,
        specifications,
        total_price: (orderList.length * 25 || 0).toFixed(2),
        email: import.meta.env.VITE_EMAIL_ADDRESS,
      };

      emailjs
        .send(
          import.meta.env.VITE_SERVICE_ID, // Added .env
          import.meta.env.VITE_TEMPLATE_ID_CUSTOM, // Added .env
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
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (orderList.length === 0) {
      navigate("/dashboard/employees");
    }
  }, []);

  return (
    <div className="w-screen min-h-screen flex justify-center items-center py-15">
      <div className="w-120 lg:sticky lg:top-8 lg:self-start rounded-xl px-4 py-6 ">
        <h1 className="font-bold mb-2 text-2xl">Submit Custom Design</h1>
        <p className="mb-2 text-fg-2/30">
          Upload your custom id card design here and let us move!
        </p>
        <div className="bg-red-500/5 w-full py-2 rounded-xl mb-5 px-2 text-justify text-sm text-red-400 border border-red-400 flex gap-2">
          <IoIosWarning size={50} className="h-fit" />
          <p className="">
            For the sake of quality, you may only submit a png or svg file whose
            width and height resolutions are 500px and above.
          </p>
        </div>
        <div className="h-50 mb-5">
          <UploadDesign
            preview={preview}
            thumbnail={thumbnail}
            setImage={setImage}
          />
        </div>
        <textarea
          name="specs"
          className="bg-bg-2 rounded-2xl w-full min-h-35 py-4 px-6 placeholder:text-fg/30 focus:outline-none resize-none mb-15"
          placeholder="Enter any specifications for our consideration"
          value={specifications}
          onChange={(e) => setSpecifications(e.target.value)}
        />
        <h1 className="font-bold mb-6 text-2xl">Order Details</h1>

        <div className="flex justify-between text-fg-2/50 mb-3">
          <p>NFC Cards ({[...orderList].length})</p>
          <p>GH₵ {(orderList.length * 25).toFixed(2)}</p>
        </div>

        <div className="flex justify-between mt-8 mb-5 font-medium">
          <p>Total</p>
          <p>GH₵ {(orderList.length * 25 || 0).toFixed(2)}</p>
        </div>

        <div className="flex gap-2">
          <button
            className="w-full bg-accent hover:bg-accent/90 duration-200 text-bg-2 py-3 rounded-full cursor-pointer"
            onClick={async () => {
              await sendEmail();
            }}
          >
            {isSubmitting ? "...Placing Order" : "Place Order"}
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
  );
};

export default CustomOrder;
