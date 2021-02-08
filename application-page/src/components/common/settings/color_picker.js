import { createMuiTheme } from '@material-ui/core';
import React,{useState} from 'react'
import { HexColorPicker } from "react-colorful";
import "react-colorful/dist/index.css";

export const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#ff0000',
      },
      secondary: {
        main: '#f44336',
      },
    },
  })

export default function ColorSetter(){
    const [color, setColor] = useState();

    return(
        <div>
            <HexColorPicker color={color} onChange={setColor} />
        </div>
        
    )
}