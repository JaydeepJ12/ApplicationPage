import { Router } from "@reach/router";
import React from "react";
import ErrorPage from "../components/common/error-page/error-page";
import Login from "../components/Login/index";
import CaseSelect from "../pages/create-case/case_select";

import EntitySelect from "../pages/create-entity/entity_select";

import Insights from "../pages/insights/insightboard";
import ApplicationItem from "../pages/items/application_item";
import OverView from "../pages/overview/overview";
import PeopleDepartment from "../pages/people-department/people_department";
import ViewCase from "../pages/viewcases/view-case";
import PrivateRoute from "./private-route";

const basePath = process.env.REACT_APP_BASE_PATH;
//3570310
const rootRoute = (
  <div>
    <Router basepath={basePath}>
      <PrivateRoute as={CaseSelect} path="/:app_id/task-select" />
      <PrivateRoute as={EntitySelect} path="/:app_id/entity-create" />
      <PrivateRoute as={OverView} path="/:app_id/overview" />
      <PrivateRoute as={PeopleDepartment} path="/:app_id/people" />
      <PrivateRoute as={ApplicationItem} path="/:app_id/items" />
      <PrivateRoute as={ViewCase} path="/:app_id/tasks" />
      <PrivateRoute as={Insights} path="/:app_id/insights" />
      <PrivateRoute as={Login} path="/:app_id/login" />
      <PrivateRoute as={ErrorPage} path="/:app_id/error" />
    </Router>
  </div>
);

export default rootRoute;
