import { makeStyles, ThemeProvider } from "@material-ui/core";
import { Router } from "@reach/router";
import React from "react";
import "./App.css";
import CaseSelect from "./components/case_select.js";
import CaseViewer from "./components/case_viewer";
import Dashboard from "./components/dashboard.js";
import OverView from "./components/overview";
import SideBar from "./components/sidebar";
import Test from "./components/test";
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
      <SideBar></SideBar>
      <div>
        <Router>
          <Dashboard path="/" />
          <CaseSelect path="case-select" />
          <OverView path="overview" />
          <Test path="test"></Test>
          <CaseViewer path="viewcase"></CaseViewer>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
