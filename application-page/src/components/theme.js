
import { createMuiTheme } from "@material-ui/core";
import React from "react";
const color = localStorage.getItem('themeColor');

const theme =  createMuiTheme({
  palette: {
    primary: {
      main: color && color != 'undefined' ? color : "#03DAC5",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ffffff",
    },
  },
});


export default theme;
