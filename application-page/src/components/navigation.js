import {
  Avatar,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Grid
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Assignment,
  ChevronLeft,
  ChevronRight,
  Create,
  Dvr,
  Menu,
  People,
  Streetview,
  Timeline,
  ViewList
} from "@material-ui/icons";
import { Link, Router } from "@reach/router";
import clsx from "clsx";
import React, { useState } from "react";
// components
import CaseSelect from "./case_select.js";
import CaseTypeForm from "./case_type_form/index";
import Login from "./Login/index.js";
import OverView from "./overview";
import Test from "./test";
import ViewCase from "./view-case";

const drawerWidth = 240;
// styles
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    background: "white",
    color: "black",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 25,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    borderBottom: "1px solid #eee",
    ...theme.mixins.toolbar,
  },
  content: {
    width: `calc(100%)`,
    padding: theme.spacing(3),
  },
  avtar: {
    marginRight: ".5em",
    backgroundColor: "transparent",
  },
}));
export default function Navigation(props) {
  const classes = useStyles();
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [isLogin, setIsLogin] = React.useState(false);

  return (
            <Router basepath='/react'>
              <CaseSelect path="/case-select" />
              <OverView path="/overview" />
              <Test path="/test"></Test>
              <CaseTypeForm path="/case-type-form"></CaseTypeForm>
              <ViewCase path="/viewcase"></ViewCase>
            </Router>
          </main>
        </div>
      )

}
