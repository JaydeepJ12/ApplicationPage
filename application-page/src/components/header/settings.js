import React,{useState, useEffect} from 'react'
import {IconButton,
    Menu,
    MenuItem
} from "@material-ui/core";
import {
    Settings as Setting,
} from "@material-ui/icons";
import ColorSetter from '../common/settings/color_picker'
import useStyles from "./header_styles";

export default function Settings(){
    const classes = useStyles()
    const [open,setOpen] = useState(false) 

    const handleClick = (e) => {
        setOpen(e.currentTarget)
    }


return (
    <div>
        <IconButton 
          onClick={handleClick}
          
          className={classes.headerMenuButton}>
            <Setting className={classes.headerIcon }/>
           
        </IconButton>
        <Menu
          className={classes.headerMenu}
          anchorEl={open}
          open={open}
          onClose={(e)=>{setOpen(null)}}
          >
            <MenuItem>
                <ColorSetter/>
            </MenuItem>
        </Menu>
        
    </div>)
}