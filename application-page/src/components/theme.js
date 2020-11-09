import { createMuiTheme } from "@material-ui/core"
import {indigo, lightBlue } from "@material-ui/core/colors"

const theme = createMuiTheme({
    palette:{
       
        primary:{
            main: indigo[500]
        },
        secondary:{
            main:lightBlue[500]
        }

    }
})

export default theme;
