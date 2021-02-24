import { createMuiTheme } from '@material-ui/core';
import React,{useState} from 'react'
import { HexColorPicker } from "react-colorful";
import "react-colorful/dist/index.css";
import theme from '../../../components/theme';

export default function ColorSetter(){

    const [color, setColor] = useState();
    
    localStorage.removeItem('themeColor');
    localStorage.setItem('themeColor', color);
    return(
        <div>
          <theme color={color}/>

      
            <HexColorPicker color={color} onChange={setColor} />
        </div>
        
    )
}