import {
  Badge,
  Button,
  IconButton,
  Link,
  Menu,
  MenuItem,
  TextField,
  Typography
} from "@material-ui/core";
import {
  NotificationsNone as NotificationsIcon,
  Person as AccountIcon,
  Search as SearchIcon
} from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { navigate } from "@reach/router";
import axios from "axios";
import classNames from "classnames";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import SecureLS from "secure-ls";
import CommonAvatar from "../../components/common/avatar";
import { isLoginPage, isUserNameSet } from "../../redux/action";
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

  const [peopleData, setPeopleData] = useState([]);
  const [searchTextValue, setSearchTextValue] = useState("");

  const timeoutRef = useRef(null);
  let timeoutVal = 1000; // time it takes to wait for user to stop typing in ms

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

  const handleNavigationClick = (username) => {
    // dispatch(isUserNameSet(username));
    navigate("people", {
      state: {
        userName: userName,
        IsTaskClick: true,
      },
    });
  };

  // this code use for navigate to other page with dat
  const handleTaskClick = () => {
    navigate("tasks", {
      state: {
        userName: userName,
        filter: 1,
        taskCount: 2,
        replace: true,
        isParent: true,
        caseTypeId: 147,
      },
    });
  };

  const searchPeople = (searchText) => {
    if (timeoutRef.current !== null) {
      // IF THERE'S A RUNNING TIMEOUT
      clearTimeout(timeoutRef.current); // THEN, CANCEL IT
    }
    if (searchText != "") {
    }

    timeoutRef.current = setTimeout(() => {
      // SET A TIMEOUT
      timeoutRef.current = null; // RESET REF TO NULL WHEN IT RUNS
      if (searchText) {
        setPeopleData([]);
        setSearchTextValue(searchText);
        getPeople(0, false, searchText, false, true);
      } else {
        setSearchTextValue("");
        setPeopleData([]);
        getPeople(0, false, "", true);
      }
    }, timeoutVal);
  };

  const getPeople = async (
    skipCount = 0,
    isPrev = false,
    searchText = "",
    isReset = false,
    isSearch = false
  ) => {
    var jsonData = {
      maxCount: 10,
      skipCount: skipCount,
      searchText: searchText,
    };
    var config = {
      method: "post",
      url: "/cases/getPeople",
      data: jsonData,
    };

    await axios(config)
      .then(function (response) {
        setPeopleData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  // end
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
        {/* <InputBase
          onInput={(event) => searchPeople(event.target.value)}
          placeholder="Search…"
        /> */}

        <div style={{ width: 300 }}>
          <Autocomplete
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            options={peopleData}
            getOptionLabel={(option) => option.FullName}
            renderOption={(option) => {
              return (
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => {
                    handleNavigationClick(option.ShortUserName);
                  }}
                >
                  {option.FullName}
                </Link>
              );
            }}
            renderInput={(params) => (
              <TextField
                style={{ marginTop: "6px" }}
                {...params}
                fullWidth={true}
                loading={"true"}
                loadingText={"Loading"}
                blurOnSelect={true}
                // onInput={(event) => searchPeople(event.target.value)}
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                  disableUnderline: true,
                }}
              />
            )}
          />
        </div>
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
          onClick={() => {
            handleNavigationClick(userName);
          }}
          className={classNames(
            classes.profileMenuItem,
            classes.headerMenuItem
          )}
        >
          <AccountIcon className={classes.profileMenuIcon} /> Profile
        </MenuItem>
        <MenuItem
          onClick={handleTaskClick}
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
