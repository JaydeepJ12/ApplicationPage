import React from "react";
import "./App.css";
import Navigation from "../src/components/header/navigation";
import { StylesProvider,ThemeProvider } from '@material-ui/core/styles';
import axios from 'axios'
import {theme} from './components/common/settings/color_picker'
axios.defaults.baseURL= process.env.REACT_APP_AXIOS_PREFIX

  {/* Your component tree.
      Now, you can override Material-UI's styles. */}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <Navigation />
      </StylesProvider>
    </ThemeProvider>
  );
}

export default App;
