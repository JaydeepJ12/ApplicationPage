import React from "react";
import "./App.css";
import Dashboard from "./components/dashboard.js";
import { ThemeProvider, makeStyles } from "@material-ui/core";
import theme from "./components/theme.js";
import CaseCreator from "./components/case_creator.js";
import { BrowserRouter, Switch, Route } from "react-router-dom";

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
        <BrowserRouter>
          <Switch>
            <Route exact path="/case-create" component={CaseCreator}></Route>
          </Switch>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
