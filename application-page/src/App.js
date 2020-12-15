import { makeStyles, ThemeProvider } from "@material-ui/core";
import { Router } from "@reach/router";
import React from "react";
import "./App.css";
import CaseSelect from "./components/case_select.js";
import CaseTypeFieldForm from "./components/case_type_form/calculated";
import CaseTypeForm from "./components/case_type_form/index";
import CaseViewer from "./components/case_viewer";
import Dashboard from "./components/dashboard.js";
import OverView from "./components/overview";
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
      <Dashboard></Dashboard>
      <div>
        <Router>
          <Dashboard path="/" />
          <CaseSelect path="case-select" />
          <OverView path="overview" />
          <Test path="test"></Test>
          <CaseTypeForm path="case-type-form"></CaseTypeForm>
          <CaseViewer path="viewcase"></CaseViewer>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
