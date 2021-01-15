import React, { useState } from "react";
import { IconButton, Menu, MenuItem, Avatar ,InputBase } from "@material-ui/core";

import {
  NotificationsNone as NotificationsIcon,
  Person as AccountIcon,
  Search as SearchIcon,
} from "@material-ui/icons";
import Settings from './settings'
import classNames from "classnames";
import { Link } from "@reach/router";
// styles
import useStyles from "./header_styles";
// components
import { Badge, Typography } from "@material-ui/core";


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
  var [isNotification, setNotificationMenu] = useState(null);
  var [isNotificationUnread, setNotificationUnread] = useState(true);
  var [profileMenu, setProfileMenu] = useState(null);
   var [isSearchOpen, setSearchOpen] = useState(false);
  return (
    <>
      <div className={classes.grow} />

      <div
          className={classNames(classes.search, {
            [classes.searchFocused]: isSearchOpen,
          })}
        >
          <div
            className={'header-icon-search_'+classNames(classes.searchIcon, {
              [classes.searchIconOpened]: isSearchOpen,
            })}
            onClick={() => setSearchOpen(!isSearchOpen)}
          >
             <IconButton color="inherit" className={classes.headerMenuButton}>
                <SearchIcon color="inherit" classes={{ root: classes.headerIcon }} />
            </IconButton>
         
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
          />
        </div>

        <Settings classes={{ root: classes.headerIcon }} />
      

      <IconButton
        color="inherit"
        onClick={(e) => {
          setNotificationMenu(e.currentTarget);
          setNotificationUnread(false);
        }}
        className={classes.headerMenuButton}
      >
        <Badge
          badgeContent={isNotificationUnread ? notifications.length : null}
          color="secondary"
        >
          <NotificationsIcon classes={{ root: classes.headerIcon }} />
        </Badge>
      </IconButton>

      <IconButton
        color="inherit"
        className={classes.headerMenuButton}
        onClick={(e) => setProfileMenu(e.currentTarget)}
      >
        <Avatar
          alt="Test"
          src="https://s3-alpha-sig.figma.com/img/67fb/f195/182fba98c8d3f90d0466b52daece2698?Expires=1610928000&Signature=WbTSsAC2RK2pr2DDwOxX44kddohUxpwnCq9Y6QFkJ73fvWpfBn1w~~Sf0GxfLpuyhu4Csza5VpKa8kFbKUA1Y5-7zAnpeqSUCspdUnnkWyyPC1mFkBdkKp~yZbsnHIENumo3wTmvz~pSDdHoyFgxOREPaCWOQukUjXQrVyem4QY~wYdbkQLOeeorCecTzOi-qcXS1PqXe~tT1qpZuytEbfpy~oo~RysXbXrfUNdpIQ4HcSKnw7I-dgJuwvx5U2mWkX8CorMgQi5dmwYd5Dwyyvd-gD7cUJUP~PFYBJ0sxIGwMb-lfz9oCe~X80q4bacvjJb9-77-HrQuQ5N3yC8Vng__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA"
        />
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
            color="secondary"
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
            Dixit Solanki
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
        <div className={classes.profileMenuUser}>
          <Typography className={classes.profileMenuLink} color="primary">
            <Link to={"/login"}>Sign Out</Link>
          </Typography>
        </div>
      </Menu>
    </>
  );
}
