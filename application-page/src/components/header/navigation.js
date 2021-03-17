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
  Typography,
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { useTheme } from "@material-ui/core/styles";
import { ChevronLeft, ChevronRight, Menu } from "@material-ui/icons";
import { Link, navigate } from "@reach/router";
import classnames from "classnames";
import clsx from "clsx";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SecureLS from "secure-ls";
import { actionData, isLoginPage } from "../../redux/action";
import rootRoute from "../../system/route";
import HeaderRight from "../header/header_right";
import menuItems from "../header/menu_items";
import Login from "../Login/index.js";
import ApplicationLinks from "./applicationLinks";
import ApplicationPageDropDown from "./applicationList";
import useStyles from "./header_styles";
import { appIdBy, appNameBy } from "../../commonMethods";

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
  const [appName, setAppName] = React.useState("");

  React.useEffect(() => {
    if (!isLoggedIn()) {
      dispatch(isLoginPage(true));
      setIsLogin(true);
      navigate(process.env.REACT_APP_LOGIN_PAGE, {});
    }

    let appId = reducerState.applicationData.appId;
    let isLogin = reducerState.applicationData.isLoginPage;

    function appNameBy(Id) {
      let applicationList = reducerState.applicationData.applicationList;
      if (applicationList.length) {
        let application = applicationList.find((app) => app.id == Id);
        if (application) {
          setAppName(application.name);
        } else {
          setAppName("page not found");
        }
      }
    }

    if (appId && !isLogin) {
      setCurrentPageValue(appId, isLogin);
      setAppId(appId);
      appNameBy(appId);
    }
  }, [
    reducerState.applicationData.appId,
    props.appId,
    reducerState.applicationData.isLoginPage,
  ]);

  const isLoggedIn = () => {
    let token = localStorage.getItem("token");
    if (token) {
      return true;
    }
    return false;
  };

  // function appNameBy(Id) {
  //   let applicationList = reducerState.applicationData.applicationList;
  //   if (applicationList.length) {
  //     let application = applicationList.find((app) => app.id == Id);
  //     if (application) {
  //       return application.name;
  //     } else {
  //       return "page not found";
  //     }
  //   }
  // }

  const setCurrentPageValue = (appId, isLoginPage = false) => {
    let path = window.location.pathname;
    let appNameTemp = appNameBy(
      appId,
      reducerState.applicationData.applicationList
    );

    appNameTemp = appNameTemp.replace(/ /g, "%20");
    if (path) {
      var parts = path.split(appNameTemp);
      path = parts[parts.length - 1];

      let isError = path === "/error";
      let page = menuItems.find((x) => x.menuPath === path);
      if (page) {
        dispatch(actionData(false, "PAGE_NOT_FOUND"));
        setCurrentPage(page.pageTitle);
      } else if (!isLoginPage && !isError) {
        dispatch(actionData(true, "PAGE_NOT_FOUND"));
        setCurrentPage("");
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

  const onLogin = (token, userName = "", displayName = "", email = "") => {
    var ls = new SecureLS({
      encodingType: "des",
      isCompression: false,
      encryptionSecret: process.env.REACT_APP_ENCRYPTION_SECRET,
    });

    dispatch(isLoginPage(false));
    localStorage.setItem("token", token);
    ls.set("userName", userName);
    localStorage.setItem("displayName", displayName);
    localStorage.setItem("email", email);
    navigate(process.env.REACT_APP_HOME_PAGE, {});
    setIsLogin(false);
  };

  return (
    <>
      {isLogin ? (
        <Login path="/login" onLogin={onLogin} />
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
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, {
                  [classes.hide]: open,
                })}
              >
                <Menu />
              </IconButton>
              <Typography>
                <Avatar>
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
            className={clsx(classes.drawer, classes.drawerColor, {
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
              <h2>Navigation</h2>
              <div></div>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
              </IconButton>
            </div>
            <List className="sidebar-navigation-block">
              {menuItems.map((item, index) => (
                <Link
                  to={basePath + appName + item.menuPath}
                  style={{ color: "black" }}
                  key={index}
                >
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
