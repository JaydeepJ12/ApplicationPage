import { Divider, makeStyles, ThemeProvider } from "@material-ui/core";
import { Router } from "@reach/router";
import React from "react";
import "./App.css";
import CaseSelect from "./components/case_select.js";
import CaseTypeForm from "./components/case_type_form/index";
import Dashboard from "./components/dashboard.js";

import Navigation from "./components/navigation";

import OverView from "./components/overview";
import Test from "./components/test";
import theme from "./components/theme.js";
import ViewCase from "./components/view-case";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    backgroundImage: `url(https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png)`,
  },
  dividerDiv: {
    marginTop: "1rem",
  },
}));
//
function App() {
  const classes = useStyles();
  return (

    <Navigation></Navigation>
    // <ThemeProvider theme={theme}>
    //   <div classes={classes.root}></div>
    //   <Dashboard></Dashboard>
    //   <div className={classes.dividerDiv}>
    //     <Divider />
    //   </div>
    //   <div>
    //     <Router>
    //       <Dashboard path="/" />
    //       <CaseSelect path="case-select" />
    //       <OverView path="overview" />
    //       <Test path="test"></Test>
    //       <CaseTypeForm path="case-type-form"></CaseTypeForm>
    //       <ViewCase path="viewcase"></ViewCase>
    //     </Router>
    //   </div>
    // </ThemeProvider>

  );
}

export default App;


/*
    
*/