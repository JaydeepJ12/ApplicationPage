import React from "react";
import {  Router } from "@reach/router";
import OverView from "../components/overview";
import ViewCase from "../components/view-case";
import PeopleDepartment from "../components/people/people_dept";
import CaseSelect from "../components/case_select";
import CaseTypeForm from "../components/case_type_form/index";
import Login from "../components/Login/index";
import * as pathConfig from "../components/api_base/path-config";
const basePath = pathConfig.BASE_ROUTE_PATH;
const rootRoute = (
  <div>
    <Router basepath={basePath}>
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
