import {
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem
} from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import { withStyles } from "@material-ui/core/styles";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Skeleton from "@material-ui/lab/Skeleton";
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import useStyles from "../../assets/css/common_styles";
import { applicationList } from "../../redux/action";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

function ApplicationListDropdown(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [applicationListData, setapplicationListData] = React.useState([]);
  const [appName, setAppName] = React.useState("");
  const [appId, setAppId] = React.useState(0);
  const reducerState = useSelector((state) => state);

  React.useEffect(() => {
    var config = {
      method: "post",
      url: "/cases/GetApplicationList",
    };
    function getApplicationList(config) {
      axios(config)
        .then(function (response) {
          if (response?.data?.responseContent) {
            let sortedResponseContent = response?.data?.responseContent;

            sortedResponseContent = response.data.responseContent.sort((a, b) =>
              a.name.localeCompare(b.name)
            );
            dispatch(applicationList(sortedResponseContent));
            setapplicationListData(sortedResponseContent);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    getApplicationList(config);
  }, []);

  React.useEffect(() => {
    setAppId(reducerState.applicationData.appId);
    if (appId && appId > 0) {
      let applicationList = [...reducerState.applicationData.applicationList];
      if (applicationList?.length) {
        let application = applicationList.find((app) => app.id == appId);
        if (application) {
          setAppName(application.name);
        } else {
          setAppName("Application Page");
        }
      }
    }
  }, [
    reducerState.applicationData.appId,
    reducerState.applicationData.applicationList,
  ]);

  const [open, setOpen] = React.useState(false);

  const handleClickList = (appId, appName, overrideUrl) => {
    setOpen(!open);
    if (overrideUrl) {
      // window.open(overrideUrl, "_blank");
      // return;
    } else if (appId && appId > 0) {
      let path = window.location.pathname;
      var parts = path.split("/");
      path = parts[parts.length - 1];
      const basePath = process.env.REACT_APP_BASE_PATH;
      window.location.href = basePath + `${appId}/${path}`;
      setAppName(appName);
    }
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClickAnchor = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAnchor = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {appName ? (
        <div className="top-app-drp-list">
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader
                style={{ cursor: "pointer" }}
                onClick={handleClickAnchor}
                component="div"
                id="nested-list-subheader"
                className={classes.listSubHeader}
              >
                {appName}
              </ListSubheader>
            }
            aria-controls="customized-menu"
            aria-haspopup="true"
            variant="contained"
            className={classes.listHeader}
          >
            <ListItem
              button
              onClick={handleClickAnchor}
              aria-owns={anchorEl ? "customized-menu" : null}
              className={classes.listHeaderItem}
            >
              <ListItemText secondary={props.currentPage} />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
          </List>
          <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseAnchor}
          >
            {applicationListData.length
              ? applicationListData.map((application) => (
                  <StyledMenuItem
                    key={application.id}
                    onClick={() =>
                      handleClickList(
                        application.id,
                        application.name,
                        application.overrideUrl
                      )
                    }
                    selected={appId === application.id}
                  >
                    <ListItemIcon>
                      <Avatar
                        className="top-app-drp-list"
                        variant="rounded"
                        fontSize="small"
                        src={`data:image/jpeg;base64,${application.imageBase64}`}
                      />
                    </ListItemIcon>
                    <ListItemText primary={application.name} />
                  </StyledMenuItem>
                ))
              : []}
          </StyledMenu>
        </div>
      ) : (
        <div>
          <Skeleton className={classes.skeletonWidth} />
        </div>
      )}
    </>
  );
}

export default ApplicationListDropdown;
