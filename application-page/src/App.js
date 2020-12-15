import { makeStyles, ThemeProvider } from "@material-ui/core";
import { Router } from "@reach/router";
import React from "react";
import "./App.css";
import CaseCreator from "./components/case_creator.js";
import Dashboard from "./components/dashboard.js";
import GlassBox from "./components/glassware";
import OverView from "./components/overview";
import theme from "./components/theme.js";
const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    backgroundImage: `url(https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png)`,
  },
}));
//<Dashboard></Dashboard>
function App() {
  const classes = useStyles();
  return (
    <div>Hello World!</div>
  );
}

export default App;


/*
    <ThemeProvider theme={theme}>
        <Router basepath='/react'>
          <CaseCreator path="/case-create" />
          <OverView path="/overview" />
          <GlassBox path="/glass"></GlassBox>
        </Router>

    </ThemeProvider>
*/