import React from 'react'
import Box from '@material-ui/core/Box';

import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((props) => createStyles({
  glass: {
    background: 'rgba( 255, 255, 255, 0.25 )',
    //'box-shadow':' 0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
    'backdrop-filter': 'blur(7px)',
    //filter: 'blur(10px)',
    'border-radius': '10px',
  },
}));

export default function GlassBox(props){
    const classes = useStyles(props)
    //'url("https://source.unsplash.com/random")'
    const bg = {'background-image':'white',
                'height':'100vh',
                'width':'100wh'}
    
    return (
        <div style = {bg}>
            <Box className={classes.glass}
                 style = {{width:500, height:500, margin:'auto'}}>
                {props.children}
                <div style={{background:'transparent'}}>HELLO WORLD</div>
            </Box>
        </div>
    )
}

