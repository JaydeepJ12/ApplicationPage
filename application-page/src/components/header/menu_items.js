import React from 'react'

import {
    Assignment,
    Create,
    Dvr,
    People,
    Streetview,
    Timeline,
    ViewList,
  } from "@material-ui/icons";
const basePath = process.env.REACT_APP_BASE_PATH

const menuItems = [
    {
      menuName: "Overview",
      menuIcon: <Streetview />,
      menuPath: basePath + "/overview",
      pageTitle: "Overview",
    },
    {
      menuName: "Tasks",
      menuIcon: <Assignment />,
      menuPath: basePath + "/tasks",
      pageTitle: "Tasks",
    },
    {
      menuName: "People",
      menuIcon: <People />,
      menuPath: basePath + "/people",
      pageTitle: "People",
    },
    {
      menuName: "People Department",
      menuIcon: <Dvr />,
      menuPath: basePath + "/people_dept",
      pageTitle: "People Department",
    },
    {
      menuName: "Items",
      menuIcon: <ViewList />,
      menuPath: basePath + "/items",
      pageTitle: "Items",
    },
    {
      menuName: "Insights",
      menuIcon: <Timeline />,
      menuPath: basePath + "/insights",
      pageTitle: "Insights",
    },
    {
      menuName: "CaseCreator",
      menuIcon: <Create />,
      menuPath: basePath + "/case-select",
      pageTitle: "Create Case",
    },
    {
      menuName: "View Cases",
      menuIcon: <ViewList />,
      menuPath: basePath + "/viewcase",
      pageTitle: "View Cases",
    },
    {
      menuName: "Case Type Form",
      menuIcon: <Dvr />,
      menuPath: basePath + "/case-type-form",
      pageTitle: "Case Type",
    },
  ];

  export default menuItems