import { MdOutlineTextFields } from "react-icons/md";
import { AiFillPicture } from "react-icons/ai";

const Toggle = (props) => {
  return (
    <label className="toggle text-fg-2/30 toggle-xl rounded-xl scale-120 py-2">
      <input
        type="checkbox"
        checked={props.isImgBased}
        onChange={(e) => {
          props.setIsImgBased(e.target.checked);
        }}
      />
      <MdOutlineTextFields aria-label="enabled" size={18} />
      <AiFillPicture aria-label="disabled" size={18} />
    </label>
  );
};

export default Toggle;
