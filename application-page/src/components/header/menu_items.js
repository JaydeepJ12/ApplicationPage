import React from 'react'

import {
    Assignment,
    Create,
    Dvr,
    People,
    Streetview,
    Timeline,
    ViewList,
    DataUsage
  } from "@material-ui/icons";

const menuItems = [
    {
      menuName: "Overview",
      menuIcon: <Streetview />,
      menuPath: "/overview",
      pageTitle: "Overview",
    },
    {
      menuName: "Tasks",
      menuIcon: <Assignment />,
      menuPath: "/tasks",
      pageTitle: "Tasks",
    },
    {
      menuName: "People",
      menuIcon: <People />,
      menuPath: "/people",
      pageTitle: "People",
    },
    {
      menuName: "People Department",
      menuIcon: <Dvr />,
      menuPath: "/people_dept",
      pageTitle: "People Department",
    },
    {
      menuName: "Application Item",
      menuIcon: <DataUsage />,
      menuPath: "/application_item",
      pageTitle: "Application Item",
    },
    {
      menuName: "Items",
      menuIcon: <ViewList />,
      menuPath: "/items",
      pageTitle: "Items",
    },
    {
      menuName: "Insights",
      menuIcon: <Timeline />,
      menuPath: "/insights",
      pageTitle: "Insights",
    },
    {
      menuName: "CaseCreator",
      menuIcon: <Create />,
      menuPath: "/case-select",
      pageTitle: "Create Case",
    },
    {
      menuName: "View Cases",
      menuIcon: <ViewList />,
      menuPath: "/viewcase",
      pageTitle: "View Cases",
    },
    {
      menuName: "Case Type Form",
      menuIcon: <Dvr />,
      menuPath: "/case-type-form",
      pageTitle: "Case Type",
    },
  ];

  export default menuItems