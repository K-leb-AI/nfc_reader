import React from "react";
import { FaCheck } from "react-icons/fa6";

const NfcDesign = (props) => {
  return (
    <div className="">
      <div className="aspect-4/5 rounded-xl overflow-hidden bg-bg-2 border border-fg/10 p-1 hover:scale-[1.03] duration-300 relative cursor-pointer">
        <img
          src={props.design.img_url}
          className="w-full h-full bg-foreground/30 rounded-lg object-cover object-center"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-bg-2 rounded-xl text-fg-2 p-2 border border-fg/10 flex flex-col items-center">
          <p className="text-xs text-fg-2/50">GH₵</p>
          <p className="font-semibold text-xl">{props.design.price}</p>
        </div>
      </div>

      <div className="mt-2 flex justify-between items-center px-2">
        <p className="">{props.design.design_name}</p>
        <button
          className={`cursor-pointer aspect-square w-8 grid place-items-center hover:bg-accent hover:text-bg duration-300 rounded-full text-xs ${props.selectedDesign.id === props.design.id ? "bg-accent text-bg" : "bg-button-bg text-fg-2"}`}
          onClick={() => {
            props.setSelectedDesign(props.design);
          }}
        >
          <FaCheck />
        </button>
      </div>
    </div>
  );
};

export default NfcDesign;
