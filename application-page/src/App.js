import React from "react";
import "./App.css";
import Navigation from "../src/components/header/navigation";
import { StylesProvider } from '@material-ui/core/styles';


  {/* Your component tree.
      Now, you can override Material-UI's styles. */}

function App() {
  return (
    <StylesProvider injectFirst>
      <Navigation />
      </StylesProvider>
  );
}

export default App;
