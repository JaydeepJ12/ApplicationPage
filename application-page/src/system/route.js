import { Router } from "@reach/router";
import React from "react";
import CaseTypeForm from "../components/case_type_form/index";
import ErrorPage from "../components/common/error-page/error-page";
import Login from "../components/Login/index";
import PeopleDepartment from "../components/people/people_dept";
import CaseSelect from "../pages/create-case/case_select";
import OverView from "../pages/overview/overview";
import ViewCase from "../pages/viewcases/view-case";
import Insights from '../pages/insights/insightboard'

const basePath = process.env.REACT_APP_BASE_PATH;
//3570310
const rootRoute = (
  <div>
    <Router basepath={basePath}>
      <CaseSelect path="/:app_id/case-select" />
      <OverView path="/:app_id/overview" default />
      <CaseTypeForm path="/:app_id/case-type-form"></CaseTypeForm>
      <PeopleDepartment path="/:app_id/people_dept" />
      <ViewCase path="/:app_id/tasks"></ViewCase>
      <Insights path='/:app_id/insights' />
      <Login path="/:app_id/login" />
      <ErrorPage path="/:app_id/error" />
    </Router>
  </div>
);

export default rootRoute;
