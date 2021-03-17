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
      menuName: "Items",
      menuIcon: <ViewList />,
      menuPath: "/items",
      pageTitle: "Items",
    },
    {
      menuName: "People",
      menuIcon: <People />,
      menuPath: "/people",
      pageTitle: "People",
    },
    
    {
      menuName: "Insights",
      menuIcon: <Timeline />,
      menuPath: "/insights",
      pageTitle: "Insights",
    },
    {
      menuName: "Task Creator",
      menuIcon: <Create />,
      menuPath: "/task-select",
      pageTitle: "Task Creator",
    },
    {
      menuName: "Entity Creator",
      menuIcon: <DataUsage />,
      menuPath: "/entity-create",
      pageTitle: "Entity Creator",
    },
  ];

  export default menuItems