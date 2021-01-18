import { StylesProvider } from "@material-ui/core/styles";
import axios from "axios";
import React from "react";
import Navigation from "../src/components/header/navigation";
import ReducerData from "./components/common/reducer-data.js";
axios.defaults.baseURL = process.env.REACT_APP_AXIOS_PREFIX;

{
  /* Your component tree.
      Now, you can override Material-UI's styles. */
}

function App() {
  return (
    <StylesProvider injectFirst>
      <Navigation />
      <ReducerData></ReducerData>
    </StylesProvider>
  );
}

export default App;
