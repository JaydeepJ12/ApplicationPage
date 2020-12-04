import { makeStyles, ThemeProvider } from "@material-ui/core";
import { Router } from "@reach/router";
import React from "react";
import "./App.css";
import CaseCreator from "./components/case_creator.js";
import Dashboard from "./components/dashboard.js";
import OverView from "./components/overview";
import theme from "./components/theme.js";
const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    backgroundImage: `url(https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png)`,
  },
}));

function App() {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <div classes={classes.root}></div>
      <Dashboard></Dashboard>
      <div>
        <Router>
          <CaseCreator path="case-create" />
          <OverView path="overview" />
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
