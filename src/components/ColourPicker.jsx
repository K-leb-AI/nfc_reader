import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";

const ColourPicker = (props) => {
  //   const [color, setColor] = useState("#aabbcc");

  return (
    <HexColorPicker
      color={
        props.colours.isPrimary
          ? props.colours.primary
          : props.colours.secondary
      }
      onChange={(newColor) => {
        if (props.colours.isPrimary)
          props.setColours((prev) => ({
            ...prev,
            primary: newColor,
          }));
        else
          props.setColours((prev) => ({
            ...prev,
            secondary: newColor,
          }));
      }}
    />
  );
};

export default ColourPicker;
