import { makeStyles } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";

const drawerWidth = 240;
export default makeStyles(
  (theme) => {
 
    return {
      // --------------------- common -----------------/
      grow: {
        flexGrow: 1,
      },

      // --------------------- profile dropdown -----------------/
      headerMenu: {
        marginTop: theme.spacing(7),
      },
      profileMenu: {
        minWidth: 265,
      },
      profileMenuUser: {
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing(2),
      },

      profileMenuIcon: {
        marginRight: theme.spacing(2),
        color: theme.palette.text.hint,
        "&:hover": {
          color: theme.palette.primary.main,
        },
      },
      profileMenuLink: {
        fontSize: 16,
        textDecoration: "none",
        "&:hover": {
          cursor: "pointer",
        },
      },

      // --------------------- profile notifiaction -----------------/
      messageNotification: {
        height: "auto",
        display: "flex",
        alignItems: "center",
        "&:hover, &:focus": {
          backgroundColor: theme.palette.background.light,
        },
      },
      messageNotificationSide: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginRight: theme.spacing(2),
      },
      messageNotificationBodySide: {
        alignItems: "flex-start",
        marginRight: 0,
      },

      // ---------------header css-------------

      root: {
        display: "flex",
        maxWidth: "100vw",
        drawerX: "hidden",
      },
      appBar: {
        backgroundColor: theme.palette.primary.main,
        color: "black",
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      },
      appBarShift: {
        backgroundColor: theme.palette.primary.main,
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
        color: theme.color,
      },
      CommonHoverColor: {
        "&:hover, &:focus": {
          backgroundColor: theme.palette.background.light,
        },
      },
      drawerOpen: {
        width: drawerWidth,
        backgroundColor: theme.palette.primary.main,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      drawerClose: {
        backgroundColor: theme.palette.primary.main,
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
      avatar: {
        marginRight: ".5em",
        backgroundColor: "transparent",
      },

      contentShift: {
        width: `calc(100vw - ${240 + theme.spacing(6)}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      fakeToolbar: {
        ...theme.mixins.toolbar,
      },
      link: {
        "&:not(:first-child)": {
          paddingLeft: 15,
        },
      },

      // -------------------------serach (11-1-2021)----------------------------

      search: {
        position: "relative",
        borderRadius: 25,
        paddingRight: theme.spacing(2),
        width: 36,
        display: "flex",
        transition: theme.transitions.create(["background-color", "width"]),
        "&:hover": {
          cursor: "pointer",
        },
      },
      searchFocused: {
        backgroundColor: fade(theme.palette.common.black, 0.08),
        width: "100%",
        [theme.breakpoints.up("md")]: {
          width: 260,
        },
      },
      searchIcon: {
        width: 36,
        right: 0,
        height: "100%",
        position: "absolute",
        display: "flex",
        "&:hover": {
          cursor: "pointer",
        },
      },
      searchIconOpened: {
        right: theme.spacing(1.25),
      },

      inputRoot: {
        color: "inherit",
        width: "100%",
      },
      inputInput: {
        height: 36,
        padding: 0,
        paddingRight: 36 + theme.spacing(1.25),
        width: "100%",
      },
      headerIcon: {
        fontSize: 28,
      },
      headerMenuButton: {
        marginLeft: theme.spacing(2),
        padding: theme.spacing(1),
      },
    };
  },
  { index: 0 }
);
