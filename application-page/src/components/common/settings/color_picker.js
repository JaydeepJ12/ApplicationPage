import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useDispatch } from "react-redux";
import "react-colorful/dist/index.css";
import { themeColor } from "../../../redux/action";
const NumberContext = React.createContext();

export default function ColorSetter() {
  const dispatch = useDispatch();
  const [color, setColor] = useState();

  if(color !== undefined){
    localStorage.setItem("themeColor", color);
  }
  React.useEffect(() => {
    dispatch(themeColor(color));
  }, [color]);

  return (
    <NumberContext.Provider color={color}>
      <HexColorPicker color={color} onChange={setColor} />
    </NumberContext.Provider>
  );
}
