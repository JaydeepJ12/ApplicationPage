import { Avatar, Box, Grid, IconButton, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";
import { navigate } from "@reach/router";
import axios from "axios";
import React, { useEffect, useState } from "react";
import * as notification from "../../components/common/toast";
import ComponentLoader from "../common/component-loader";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles(
  (theme) => ({
    cursor: { cursor: "pointer" },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    fonts: {
      fontSize: "larger",
      fontWeight: "bold",
    },
  }),
  { index: 1 }
);

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function PeoplePreview(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [userName, setUserName] = React.useState(props.userName);
  const [userFullName, setUserFullName] = React.useState(props.userFullName);
  const [userInfo, setUserInfo] = useState([]);
  const [userManager, setUserManager] = React.useState("");
  const [relatedCasesCountData, setRelatedCasesCountData] = useState([]);
  const [componentLoader, setComponentLoader] = useState(false);
  const [userInfoComponentLoader, setUserInfoComponentLoader] = useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");

  const navigateToErrorPage = (message) => {
    navigate(process.env.REACT_APP_ERROR_PAGE, {
      state: {
        errorMessage: message,
      },
    });
  };

  const getUserInfo = async () => {
    var jsonData = {
      userShortName: props.userName,
    };

    var config = {
      method: "post",
      url: "/cases/getUserInfo",
      data: jsonData,
    };

    await axios(config)
      .then(function (response) {
        let userInfoData = response.data[0];
        setUserInfo(userInfoData);
        setUserInfoComponentLoader(false);
        let manager = userInfoData?.MANAGER_LDAP_PATH;
        if (manager) {
          manager = manager.split("=")[1]?.split(",")[0];
          setUserManager(manager);
        }
      })
      .catch(function (error) {
        console.log(error);
        navigateToErrorPage(error?.message);
      });
  };

  const getRelatedCasesCountData = async () => {
    setUserInfoComponentLoader(true);
    setComponentLoader(true);
    var jsonData = {
      caseId: 0,
      caseTypeId: 0,
      assignedToMe: true,
      isActive: "string",
      systemCode: "string",
      username: props.userName,
      pageNumber: 0,
      pageSize: 0,
      userOwner: "string",
      userAssignTo: "string",
      userCreatedBy: "string",
      userTeam: "string",
      userClosedby: "string",
    };

    var config = {
      method: "post",
      url: "/cases/getRelatedCasesCountData",
      data: jsonData,
    };

    await axios(config)
      .then(function (response) {
        if (response?.data?.responseContent) {
          setRelatedCasesCountData(response.data.responseContent);
        }
        setComponentLoader(false);
        getUserInfo();
      })
      .catch(function (error) {
        console.log(error);
        navigateToErrorPage(error?.message);
      });
  };

  const handleTaskClick = (userName, filter, taskCount) => {
    if (taskCount <= 0) {
      notification.toast.warning("No task available...!!");
      return false;
    }
    navigate("tasks", {
      state: {
        userName: userName,
        filter: filter,
        taskCount: taskCount,
        replace: true,
        isParent: true,
      },
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    props.handleClose(false);
    setOpen(false);
  };

  const addDefaultSrc = (event) => {
    let userDefaultImage = require("../../assets/images/default-userimage.png");
    if (userDefaultImage) {
      event.target.src = userDefaultImage;
    }
  };

  const renderUserImage = (userName) => {
    if (userName) {
      return (
        <Avatar
          onError={(event) => addDefaultSrc(event)}
          className={classes.large}
          alt={userName}
          src={process.env.REACT_APP_USER_ICON.concat(userName)}
        />
      );
    } else {
      return (
        <Avatar
          className={classes.large}
          alt={userName}
          src="../../assets/images/default-userimage.png"
        />
      );
    }
  };

  useEffect(() => {
    if (props.open && props.userName) {
      setUserManager("");
      setOpen(props.open);
      setUserName(props.userName);
      setUserFullName(props.userFullName);
      getRelatedCasesCountData();
    }
  }, [props.open, props.userName, props.userFullName]);

  return (
    <div>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          User Profile
        </DialogTitle>
        <DialogContent dividers>
          <form noValidate autoComplete="off">
            <div className="text-center">
              <IconButton color="inherit" className={classes.headerMenuButton}>
                {renderUserImage(userName)}
              </IconButton>
            </div>
            <Typography
              className={classes.fonts}
              align="center"
              variant="caption"
              display="block"
              gutterBottom
            >
              {userFullName}
            </Typography>
            {componentLoader ? (
              <ComponentLoader type="rect" />
            ) : (
              <ListItem>
                <Grid container spacing={3}>
                  <Grid item lg={3} md={3} xs={3} sm={3}>
                    <Box
                      className={classes.cursor}
                      onClick={() =>
                        handleTaskClick(
                          userName,
                          1,
                          relatedCasesCountData?.assignedCases
                        )
                      }
                    >
                      <Typography
                        className={classes.fontWeight}
                        variant="caption"
                        display="block"
                        gutterBottom
                        variant="h5"
                        align="center"
                      >
                        {relatedCasesCountData?.assignedCases}
                      </Typography>
                      <Typography
                        align="center"
                        variant="caption"
                        display="block"
                        gutterBottom
                      >
                        Assigned Cases
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item lg={3} md={3} xs={3} sm={3}>
                    <Box
                      className={classes.cursor}
                      onClick={() =>
                        handleTaskClick(
                          userName,
                          4,
                          relatedCasesCountData?.ownedCases
                        )
                      }
                    >
                      <Typography
                        className={classes.fontWeight}
                        variant="caption"
                        display="block"
                        gutterBottom
                        variant="h5"
                        align="center"
                      >
                        {relatedCasesCountData?.ownedCases}
                      </Typography>
                      <Typography
                        align="center"
                        variant="caption"
                        display="block"
                        gutterBottom
                      >
                        Owned Cases
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item lg={3} md={3} xs={3} sm={3}>
                    <Box
                      className={classes.cursor}
                      onClick={() =>
                        handleTaskClick(
                          userName,
                          3,
                          relatedCasesCountData?.createdCases
                        )
                      }
                    >
                      <Typography
                        className={classes.fontWeight}
                        variant="caption"
                        display="block"
                        gutterBottom
                        variant="h5"
                        align="center"
                      >
                        {relatedCasesCountData?.createdCases}
                      </Typography>
                      <Typography
                        align="center"
                        variant="caption"
                        display="block"
                        gutterBottom
                      >
                        Created Cases
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item lg={3} md={3} xs={3} sm={3}>
                    <Box>
                      <Typography
                        className={classes.fontWeight}
                        variant="caption"
                        display="block"
                        gutterBottom
                        variant="h5"
                        align="center"
                      >
                        {relatedCasesCountData?.myHoppers +
                          relatedCasesCountData?.myAssociations +
                          relatedCasesCountData?.entityRoleAssociations}
                      </Typography>
                      <Typography
                        align="center"
                        variant="caption"
                        display="block"
                        gutterBottom
                      >
                        Related Items
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </ListItem>
            )}
            {userInfo && userInfoComponentLoader ? (
              <ComponentLoader type="rect" />
            ) : (
              <List p={0}>
                <ListItem>
                  <TextField
                    disabled
                    label="Real Name"
                    defaultValue={userInfo?.FULL_NAME}
                    fullWidth
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    disabled
                    label="Department Name"
                    defaultValue={userInfo?.DEPARTMENT_NAME}
                    fullWidth
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    disabled
                    id="standard-disabled"
                    label="Job Title"
                    defaultValue={userInfo?.JOB_TITLE}
                    fullWidth
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    disabled
                    id="standard-disabled"
                    label="Office Phone"
                    defaultValue={userInfo?.PHONE_NUMBER}
                    fullWidth
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    disabled
                    id="standard-disabled"
                    label="Cell Phone"
                    defaultValue={userInfo?.MOBILE_NUMBER}
                    fullWidth
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    disabled
                    id="standard-disabled"
                    label="City State"
                    defaultValue={userInfo?.CITY + " " + userInfo?.STATE}
                    fullWidth
                  />
                </ListItem>
                {userManager ? (
                  <ListItem>
                    <TextField
                      disabled
                      id="standard-disabled"
                      label="Manager / Supervisor"
                      defaultValue={userManager}
                      fullWidth
                    />
                  </ListItem>
                ) : (
                  ""
                )}
              </List>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
