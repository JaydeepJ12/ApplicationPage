import React from "react";
import Navigation from "../src/components/header/navigation";
import "./App.css";
import ReducerData from "./components/common/reducer-data.js";

function App() {
  return (
    <>
      <Navigation></Navigation>
      <ReducerData></ReducerData>
    </>
  );
}
export default App;
