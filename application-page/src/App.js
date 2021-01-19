import {
  createGenerateClassName, StylesProvider
} from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import axios from "axios";
import React from "react";
import Navigation from "../src/components/header/navigation";
import theme from "../src/components/theme";
import ReducerData from "./components/common/reducer-data.js";

const generateClassName = createGenerateClassName({
  productionPrefix: "c",
});
axios.defaults.baseURL = process.env.REACT_APP_AXIOS_PREFIX;

{
  /* Your component tree.
      Now, you can override Material-UI's styles. */
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <StylesProvider generateClassName={generateClassName} injectFirst>
        <Navigation />
        <ReducerData></ReducerData>
      </StylesProvider>
    </ThemeProvider>
  );
}

export default App;
