import {
  Badge,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Typography
} from "@material-ui/core";
import {
  NotificationsNone as NotificationsIcon,
  Person as AccountIcon,
  Search as SearchIcon
} from "@material-ui/icons";
import { navigate } from "@reach/router";
import classNames from "classnames";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import SecureLS from "secure-ls";
import CommonAvatar from "../../components/common/avatar";
import { isLoginPage } from "../../redux/action";
// styles
import useStyles from "./header_styles";
import Settings from "./settings";

const notifications = [
  {
    id: 0,
    variant: "warning",
    name: "Dixit",
    notification: "New Task Assign",
    time: "9:32",
  },
  {
    id: 1,
    variant: "success",
    name: "Bhavik",
    notification: "Check out my new Dashboard",
    time: "9:18",
  },
  {
    id: 2,
    variant: "primary",
    name: "Satish",
    notification: "I want rearrange the meeting",
    time: "9:15",
  },
  {
    id: 3,
    variant: "secondary",
    name: "Hardik",
    notification: "Good news from development department",
    time: "9:09",
  },
];

export default function HeaderRight() {
  var classes = useStyles();
  const dispatch = useDispatch();

  var [isNotification, setNotificationMenu] = useState(null);
  var [isNotificationUnread, setNotificationUnread] = useState(true);
  var [profileMenu, setProfileMenu] = useState(null);
  var [isSearchOpen, setSearchOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  React.useEffect(() => {
    
    var ls = new SecureLS({
      encodingType: "des",
      isCompression: false,
      encryptionSecret: process.env.REACT_APP_ENCRYPTION_SECRET,
    });

    let displayName = localStorage.getItem("displayName");
    let userName = ls.get("userName");
    let email = localStorage.getItem("email");

    if (displayName) {
      setDisplayName(displayName);
    }
    if (userName) {
      setUserName(userName);
    }
    if (email) {
      setEmail(email);
    }
  }, []);

  const signOut = () => {
    localStorage.removeItem("token");
    dispatch(isLoginPage(false));
    navigate("login");
  };
  return (
    <>
      <div className={classes.grow} />

      <div
        className={classNames(classes.search, {
          [classes.searchFocused]: isSearchOpen,
        })}
      >
        <div
          className={
            "header-icon-search_" +
            classNames(classes.searchIcon, {
              [classes.searchIconOpened]: isSearchOpen,
            })
          }
          onClick={() => setSearchOpen(!isSearchOpen)}
        >
          <IconButton className={classes.headerMenuButton}>
            <SearchIcon className={classes.headerIcon} />
          </IconButton>
        </div>
        <InputBase placeholder="Search…" />
      </div>
      <Settings className={classes.headerIcon} />

      <IconButton
        onClick={(e) => {
          setNotificationMenu(e.currentTarget);
          setNotificationUnread(false);
        }}
        className={classes.headerMenuButton}
      >
        <Badge
          badgeContent={isNotificationUnread ? notifications.length : null}
          color={"secondary"}
        >
          <NotificationsIcon className={classes.headerIcon} />
        </Badge>
      </IconButton>

      <IconButton
        color="inherit"
        className={classes.headerMenuButton}
        onClick={(e) => setProfileMenu(e.currentTarget)}
      >
        <CommonAvatar name={userName} sizeClass={classes.avt_small} />
      </IconButton>
      <Menu
        id="notifiation-list"
        open={isNotification}
        anchorEl={isNotification}
        onClose={() => setNotificationMenu(null)}
        className={classes.headerMenu}
      >
        <div className={classes.profileMenuUser}>
          <Typography variant="h5" weight="medium">
            New Notification
          </Typography>
          <Typography
            className={classes.profileMenuLink}
            component="a"
            color={"secondary"}
          >
            {notifications.length} New Notifications
          </Typography>
        </div>

        {notifications.map((notification) => (
          <MenuItem key={notification.id}>
            <div>
              <Typography weight="medium" color="primary">
                {notification.name}
              </Typography>
              <Typography color="text" colorBrightness="secondary">
                {notification.notification}
              </Typography>
            </div>
          </MenuItem>
        ))}
      </Menu>

      <Menu
        id="profile-menu"
        open={profileMenu}
        anchorEl={profileMenu}
        onClose={() => setProfileMenu(null)}
        className={classes.headerMenu}
      >
        <div className={classes.profileMenuUser}>
          <Typography variant="h6" weight="medium">
            {displayName ? displayName : "Stemmons User"}
          </Typography>
        </div>
        <MenuItem
          className={classNames(
            classes.profileMenuItem,
            classes.headerMenuItem
          )}
        >
          <AccountIcon className={classes.profileMenuIcon} /> Profile
        </MenuItem>
        <MenuItem
          className={classNames(
            classes.profileMenuItem,
            classes.headerMenuItem
          )}
        >
          <AccountIcon className={classes.profileMenuIcon} /> Tasks
        </MenuItem>
        <MenuItem
          className={classNames(
            classes.profileMenuItem,
            classes.headerMenuItem
          )}
        >
          <AccountIcon className={classes.profileMenuIcon} /> Cases
        </MenuItem>
        <MenuItem
          className={classNames(
            classes.profileMenuItem,
            classes.headerMenuItem
          )}
        ></MenuItem>

        <div className={classes.profileMenuUser}>
          <Typography className={classes.profileMenuLink} color="primary">
            <Button onClick={signOut}>Sign Out</Button>
          </Typography>
        </div>
      </Menu>
    </>
  );
}
