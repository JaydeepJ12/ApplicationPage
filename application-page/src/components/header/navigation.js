// styles
import {
  Avatar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { useTheme } from "@material-ui/core/styles";
import { ChevronLeft, ChevronRight, Menu } from "@material-ui/icons";
import { Link } from "@reach/router";
import classnames from "classnames";
import clsx from "clsx";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionData } from "../../redux/action";
import rootRoute from "../../system/route";
import HeaderRight from "../header/header_right";
import menuItems from "../header/menu_items";
import Login from "../Login/index.js";
import ApplicationPageDropDown from "./applicationList";
import ApplicationLinks from "./applicationLinks";
import useStyles from "./header_styles";

export default function Navigation(props) {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [isLogin, setIsLogin] = React.useState(false);
  const [basePath, setBasePath] = useState(process.env.REACT_APP_BASE_PATH);
  const reducerState = useSelector((state) => state);
  const [appId, setAppId] = React.useState(0);

  React.useEffect(() => {
    let appId = reducerState.applicationData.appId;
    if (appId) {
      setCurrentPageValue(appId);
      setBasePath(basePath + appId);
      setAppId(appId);
    }
  }, [reducerState.applicationData.appId, props.appId]);

  const setCurrentPageValue = (appId) => {
    let path = window.location.pathname;

    if (path) {
      var parts = path.split(appId);
      path = parts[parts.length - 1];

      let isLogin = path === "/login";
      let isError = path === "/error";

      let page = menuItems.find((x) => x.menuPath === path);
      if (page) {
        dispatch(actionData(false, "PAGE_NOT_FOUND"));
        setCurrentPage(page.pageTitle);
      } else if (!isLogin && !isError) {
        dispatch(actionData(true, "PAGE_NOT_FOUND"));
        setCurrentPage("");
      }

      if (isLogin) {
        setIsLogin(true);
      }

      if (isError) {
        dispatch(actionData(true, "ERROR_PAGE"));
        setCurrentPage("Error");
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
    <>
      {isLogin ? (
        <Login path="/login" />
      ) : (
        <div className={classes.root} >
          <AppBar 
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <Toolbar>
              <IconButton
               
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
                    style={{ maxWidth: "100%" }}
                    className="header-logo"
                    alt="stemmons-logo"
                  ></img>
                </Avatar>
              </Typography>

              <Typography variant="h6" noWrap>
                <ApplicationPageDropDown currentPage={currentPage} />
              </Typography>
              <Typography variant="h6" noWrap>
                <ApplicationLinks />
              </Typography>

              <HeaderRight />
            </Toolbar>
          </AppBar>

          <Drawer 
            variant="permanent"
            className={clsx(classes.drawer,classes.drawer, {
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
            <div className={classes.toolbar + " side-click"} >
              <h2>Navigation</h2>
              <div></div>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
              </IconButton>
            </div>
            <List className="sidebar-navigation-block">
              {menuItems.map((item, index) => (
                <Link to={basePath + item.menuPath} style={{ color: "black" }}>
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
          <div className={classnames(classes.content)}>
            <div className={classes.fakeToolbar} />
            {rootRoute}
          </div>
        </div>
      )}
    </>
  );
}
