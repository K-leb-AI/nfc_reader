import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BiUpload, BiX } from "react-icons/bi";

const UploadDesign = (props) => {
  const [thumbnail, setThumbnail] = useState(props.thumbnail || null);
  const [preview, setPreview] = useState(props.preview || null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setThumbnail(props.thumbnail || null);
    setPreview(props.preview || null);
  }, [props.thumbnail, props.preview, props.reset]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          thumbnail_url: "Please upload an image file",
        }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          thumbnail_url: "Image size must be less than 5MB",
        }));
        return;
      }
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = function () {
        console.log("Entered");
        if (this.naturalHeight < 500 || this.naturalWidth < 500)
          return toast("Your image width/height cannot be less than 500px");
        URL.revokeObjectURL(this.src);
      };

      const allowedTypes = ["image/png", "image/svg+xml"];
      const allowedExtensions = /(\.png|\.svg)$/i;

      if (
        !allowedTypes.includes(file.type) ||
        !allowedExtensions.exec(file.name)
      ) {
        return toast.error("Please select a valid PNG or SVG file.");
      }

      setThumbnail(file);
      props.setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({
        ...prev,
        thumbnail_url: "",
      }));
    }
  };
  const removeThumbnail = () => {
    setThumbnail(null);
    setPreview(null);
    if (props.setImage) props.setImage("");
  };

  return (
    <div className="relative w-full h-full">
      {thumbnail ? (
        <div className="relative w-full h-full">
          <img
            src={preview}
            alt="Thumbnail preview"
            className="w-full h-full object-cover rounded-2xl object-center"
          />
          <button
            type="button"
            onClick={removeThumbnail}
            className="absolute top-2 right-2 p-1 bg-red-500 text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <BiX className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center w-full h-full cursor-pointer rounded-2xl transition-colors ${
            errors.thumbnail_url
              ? "border-red-400 bg-destructive/5 hover:bg-destructive/10"
              : "bg-muted/30 hover:bg-muted/65"
          }`}
        >
          <div className="flex flex-col items-center justify-center bg-bg-2 border border-white/6 border-dashed rounded-2xl focus:outline-none text-white w-full h-full">
            <BiUpload className="w-10 h-10 text-[#888]/65 mb-5" />
            <p className="text-sm text-[#888]/65 text-center w-4/5">
              Click to upload your design image
            </p>
            <p className="text-xs text-[#888]/65 mt-2">PNG or SVG up to 10MB</p>
          </div>
          <input
            id="thumbnail"
            type="file"
            // accept="image/*"
            accept=".png, image/png, .svg, image/svg+xml"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

export default UploadDesign;
