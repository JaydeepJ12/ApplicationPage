import React from "react";
import {  Router } from "@reach/router";
import OverView from "../pages/overview/overview";
import ViewCase from "../pages/viewcases/view-case";
import PeopleDepartment from "../components/people/people_dept";
import CaseSelect from "../components/case_select";
import CaseTypeForm from "../components/case_type_form/index";
import Login from "../components/Login/index";

const basePath = process.env.REACT_APP_BASE_PATH;

const rootRoute = (
  <div>
    <Router basepath={process.env.REACT_APP_BASE_PATH}>
      <CaseSelect path="/case-select" />
      <OverView path="/overview" default />
      <CaseTypeForm path="/case-type-form"></CaseTypeForm>
      <PeopleDepartment path="/people_dept" />
      <ViewCase path="/tasks"></ViewCase>
      <Login path="/login" />
    </Router>
  </div>
);

export default rootRoute;
