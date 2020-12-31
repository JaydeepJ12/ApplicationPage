import { Avatar } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Streetview } from "@material-ui/icons";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CreateIcon from "@material-ui/icons/Create";
import DvrIcon from "@material-ui/icons/Dvr";
import MenuIcon from "@material-ui/icons/Menu";
import PeopleIcon from "@material-ui/icons/People";
import TimelineIcon from "@material-ui/icons/Timeline";
import ViewListIcon from "@material-ui/icons/ViewList";
import { Link, Router } from "@reach/router";
import clsx from "clsx";
import React, { useState } from "react";
import AppIcon from "./app_icon.js";
import CaseSelect from "./case_select.js";
import CaseTypeForm from "./case_type_form/index";
import Login from "./Login/index.js";
import OverView from "./overview";
import Test from "./test";
import ViewCase from "./view-case";

const drawerWidth = 240;

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: "flex",
//   },
//   appBar: {
//     background: "white",
//     color: "black",
//     transition: theme.transitions.create(["margin", "width"], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//   },
//   appBarShift: {
//     width: `calc(100% - ${drawerWidth}px)`,
//     marginLeft: drawerWidth,
//     transition: theme.transitions.create(["margin", "width"], {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//   },
//   hide: {
//     display: "none",
//   },
//   drawer: {
//     width: drawerWidth,
//     flexShrink: 0,
//   },
//   drawerPaper: {
//     width: drawerWidth,
//   },
//   drawerHeader: {
//     display: "flex",
//     alignItems: "center",
//     padding: theme.spacing(0, 1),
//     // necessary for content to be below app bar
//     ...theme.mixins.toolbar,
//     justifyContent: "flex-end",
//   },
//   content: {
//     // flexGrow: 1,
//     padding: theme.spacing(3),
//     transition: theme.transitions.create("margin", {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//     marginLeft: -drawerWidth,
//   },
//   contentShift: {
//     transition: theme.transitions.create("margin", {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     marginLeft: 0,
//   },
//   avtar: {
//     marginLeft: "-1rem",
//   },
// }));
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
    marginRight: 36,
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
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    //   flexGrow: 1,
    padding: theme.spacing(3),
  },
  avtar: {
    // marginLeft: "-1rem",
  },
}));
// const useStyles = makeStyles((theme) => ({
//   root: {
//     minHeight: "100vh",
//     backgroundImage: `url(https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png)`,
//   },
//   dividerDiv: {
//     marginTop: "1rem",
//   },
// }));

export default function Navigation(props) {
  // const classes = useStyles();
  // return (
  //   <ThemeProvider theme={theme}>
  //     <div classes={classes.root}></div>
  //     <Dashboard></Dashboard>
  //     <div className={classes.dividerDiv}>
  //       <Divider />
  //     </div>
  //     <div>
  //       <Router>
  //         <Dashboard path="/" />
  //         <CaseSelect path="case-select" />
  //         <OverView path="overview" />
  //         <Test path="test"></Test>
  //         <CaseTypeForm path="case-type-form"></CaseTypeForm>
  //         <ViewCase path="viewcase"></ViewCase>
  //       </Router>
  //     </div>
  //   </ThemeProvider>
  // );
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
      menuIcon: <AssignmentIcon />,
      menuPath: "tasks",
      pageTitle: "Tasks",
    },
    {
      menuName: "People",
      menuIcon: <PeopleIcon />,
      menuPath: "people",
      pageTitle: "People",
    },
    {
      menuName: "Items",
      menuIcon: <ViewListIcon />,
      menuPath: "items",
      pageTitle: "Items",
    },
    {
      menuName: "Insights",
      menuIcon: <TimelineIcon />,
      menuPath: "insights",
      pageTitle: "Insights",
    },
    {
      menuName: "CaseCreator",
      menuIcon: <CreateIcon />,
      menuPath: "case-select",
      pageTitle: "Create Case",
    },
    {
      menuName: "View Cases",
      menuIcon: <ViewListIcon />,
      menuPath: "viewcase",
      pageTitle: "View Cases",
    },
    {
      menuName: "Case Type Form",
      menuIcon: <DvrIcon />,
      menuPath: "case-type-form",
      pageTitle: "Case Type",
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

  const navigateToRoute = (props, route) => {
    props.navigate("/case-create");
  };

  const app_icon =
    "http://entities.boxerproperty.com//Download.aspx?FileID=458702";
  const name = "Inside Sales";
  const avatar =
    "http://services.boxerproperty.com/userphotos/DownloadPhoto.aspx?username=MichaelAF";
  return (
    <div>
      {isLogin ? (
        <Login path="/login" />
      ) : (
        <div className={classes.root}>
          <CssBaseline />
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
                <MenuIcon />
              </IconButton>
              <Typography className={classes.avtar}>
                <Avatar className={classes.avtar}>
                  <img src="http://home.boxerproperty.com/Assets/CommonFiles/New_Images/Main_logo.png"></img>
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
            <div className={classes.toolbar}>
              {open ? (
                <ListItem>
                  <AppIcon src={app_icon} name={name}></AppIcon>
                </ListItem>
              ) : (
                ""
              )}
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </div>
            <Divider />
            <List>
              {menuItems.map((item, index) => (
                <ListItem
                  onClick={() => {
                    setCurrentPage(item.pageTitle);
                    // navigateToRoute(props, item.menuPath);
                  }}
                >
                  <ListItemIcon>{item.menuIcon}</ListItemIcon>
                  <ListItemText>
                    <Link to={item.menuPath} style={{ color: "black" }}>
                      {item.menuName}
                    </Link>
                  </ListItemText>
                </ListItem>
              ))}
            </List>
            {/* <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List> */}
          </Drawer>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Router>
              <CaseSelect path="case-select" />
              <OverView path="overview" />
              <Test path="test"></Test>
              <CaseTypeForm path="case-type-form"></CaseTypeForm>
              <ViewCase path="viewcase"></ViewCase>
            </Router>
          </main>
        </div>
      )}
    </div>
    // <div className={classes.root}>
    //   <CssBaseline />
    //   <AppBar
    //     position="fixed"
    //     className={clsx(classes.appBar, {
    //       [classes.appBarShift]: open,
    //     })}
    //   >
    //     <Toolbar>
    //       <IconButton
    //         color="inherit"
    //         aria-label="open drawer"
    //         onClick={handleDrawerOpen}
    //         edge="start"
    //         className={clsx(classes.menuButton, open && classes.hide)}
    //       >
    //         <MenuIcon />
    //       </IconButton>
    //       <Typography className={classes.avtar}>
    //         <Avatar>
    //           <img src="http://home.boxerproperty.com/Assets/CommonFiles/New_Images/Main_logo.png"></img>
    //         </Avatar>
    //       </Typography>

    //       <Typography variant="h6" noWrap>
    //         {currentPage}
    //       </Typography>
    //     </Toolbar>
    //   </AppBar>
    //   <Drawer
    //     className={classes.drawer}
    //     variant="persistent"
    //     anchor="left"
    //     open={open}
    //     classes={{
    //       paper: classes.drawerPaper,
    //     }}
    //   >
    //     <div className={classes.drawerHeader}>
    //       <ListItem alignItems="center">
    //         <AppIcon src={app_icon} name={name}></AppIcon>
    //       </ListItem>
    //       <IconButton onClick={handleDrawerClose}>
    //         {theme.direction === "ltr" ? (
    //           <ChevronLeftIcon />
    //         ) : (
    //           <ChevronRightIcon />
    //         )}
    //       </IconButton>
    //     </div>
    //     <Divider />
    //     <List>
    //       {menuItems.map((item, index) => (
    //         <ListItem
    //           onClick={() => {
    //             setCurrentPage(item.pageTitle);
    //           }}
    //         >
    //           <ListItemIcon>{item.menuIcon}</ListItemIcon>
    //           <ListItemText>
    //             <Link to={item.menuPath} style={{ color: "black" }}>
    //               {item.menuName}
    //             </Link>
    //           </ListItemText>
    //         </ListItem>
    //       ))}
    //     </List>
    //   </Drawer>
    //   <main
    //     className={clsx(classes.content, {
    //       [classes.contentShift]: open,
    //     })}
    //   >
    //     <div className={classes.drawerHeader} />
    //     <Router>
    //       <CaseSelect path="case-select" />
    //       <OverView path="overview" />
    //       <Test path="test"></Test>
    //       <CaseTypeForm path="case-type-form"></CaseTypeForm>
    //       <ViewCase path="viewcase"></ViewCase>
    //     </Router>
    //   </main>
    // </div>
  );
}
