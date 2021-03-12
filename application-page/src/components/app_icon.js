import React from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {
    Avatar,
    Box,
    IconButton,
    makeStyles,
    Typography}  from '@material-ui/core'
import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles((theme)=>({
        small: {
            width: theme.spacing(3),
            height: theme.spacing(3),
          },
          large: {
            width: theme.spacing(7),
            height: theme.spacing(7),
          },
    }), {index: 1})

export default function AppIcon(props){
    const classes = useStyles()

    return (    
        <Box>
            <Avatar src={props.src}
                    className={classes.large}>
            </Avatar>
        
            <IconButton size="small">
                <Typography>
                    {props.name}
                </Typography>  
                <ArrowDropDownIcon/>
            </IconButton>
        </Box>

    )
}

function AvatarIcon(props){
    const classes = useStyles()

    return (    
        <Box>
            <IconButton size="small">
                <NotificationsIcon/>
            </IconButton>
            <IconButton size="small">
                <SettingsIcon/>
            </IconButton>
            <Avatar src={props.src}
                    className={classes.large}>
            </Avatar>
        
            
        </Box>

    )
}
export {AvatarIcon};
