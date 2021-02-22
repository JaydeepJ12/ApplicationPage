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
  Grid,
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
  ViewList,
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
import Example from "./react_graph/common_graph";
import Insights from '../pages/insights/insightboard'

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

  const menuItems = [
    {
      menuName: "Overview",
      menuIcon: <Streetview />,
      menuPath: "overview",
      pageTitle: "Overview",
    },
    {
      menuName: "Tasks",
      menuIcon: <Assignment />,
      menuPath: "tasks",
      pageTitle: "Tasks",
    },
    {
      menuName: "People",
      menuIcon: <People />,
      menuPath: "people",
      pageTitle: "People",
    },
    {
      menuName: "Items",
      menuIcon: <ViewList />,
      menuPath: "items",
      pageTitle: "Items",
    },
    {
      menuName: "Insights",
      menuIcon: <Timeline />,
      menuPath: "insights",
      pageTitle: "Insights",
    },
    {
      menuName: "CaseCreator",
      menuIcon: <Create />,
      menuPath: "case-select",
      pageTitle: "Create Case",
    },
    {
      menuName: "View Cases",
      menuIcon: <ViewList />,
      menuPath: "viewcase",
      pageTitle: "View Cases",
    },
    {
      menuName: "Case Type Form",
      menuIcon: <Dvr />,
      menuPath: "case-type-form",
      pageTitle: "Case Type",
    },
    {
      menuName: "Graph",
      menuIcon: <Dvr />,
      menuPath: "graph",
      pageTitle: "Case Graph",
    },
  ];

  React.useEffect(() => setCurrentPageValue(), []);

  const setCurrentPageValue = () => {
    let path = window.location.pathname.replace("/", "");
    if (path) {
      let page = menuItems.find((x) => x.menuPath == path);
      if (page) {
        setCurrentPage(page.pageTitle);
      }
      if (path === "login") {
        setIsLogin(true);
      }
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className="side-navigation">
      {isLogin ? (
        <Login path="/login" />
      ) : (
        <div className={classes.root}>
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, {
                  [classes.hide]: open,
                })}
              >
                <Menu />
              </IconButton>
              <Typography className={classes.avtar}>
                <Avatar className={classes.avtar}>
                  <img
                    src="http://home.boxerproperty.com/Assets/CommonFiles/New_Images/Main_logo.png"
                    style={{ "max-width": "100%" }}
                    className="header-logo"
                    alt="stemmons-logo"
                  ></img>
                </Avatar>
              </Typography>

              <Typography variant="h6" noWrap>
                {currentPage}
              </Typography>
            </Toolbar>
          </AppBar>

          <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              }),
            }}
          >
            <div className={classes.toolbar + " side-click"}>
              {/*-------note:----code for dropdownlist(future development)
              {/*{open ? (
                <ListItem>
                  <AppIcon src={app_icon} name={name}></AppIcon>
                </ListItem>
              ) : (
                ""
              )} */}
              <h2>Navigation</h2>
              <div></div>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
              </IconButton>
            </div>
            <List className="sidebar-navigation-block">
              {menuItems.map((item, index) => (
                <Link to={item.menuPath} style={{ color: "black" }}>
                  <ListItem
                    onClick={() => {
                      setCurrentPage(item.pageTitle);
                    }}
                  >
                    <ListItemIcon>{item.menuIcon}</ListItemIcon>
                    <ListItemText>{item.menuName}</ListItemText>
                  </ListItem>
                </Link>
              ))}
            </List>
          </Drawer>
          <main className={classes.content}>
            <Router basepath="/react">
              <CaseSelect path="/case-select" />
              <OverView path="/overview" />
              <Test path="/test"></Test>
              <Insights path='/insights'/>
              <CaseTypeForm path="/case-type-form"></CaseTypeForm>
              <ViewCase path="/viewcase"></ViewCase>
              <Example path="/graph"></Example>
            </Router>
          </main>
        </div>
      )}
    </div>
  );
}
