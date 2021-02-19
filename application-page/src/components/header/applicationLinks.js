import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  MenuItem,
} from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import { withStyles } from "@material-ui/core/styles";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Skeleton from "@material-ui/lab/Skeleton";
import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import useStyles from "../../assets/css/common_styles";

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

function ApplicationLinks() {
  const classes = useStyles();
  const reducerState = useSelector((state) => state);
  const [noDataFound, setNoDataFound] = React.useState(false);
  const [applink, setApplink] = React.useState([]);

  React.useEffect(() => {
    async function getAppLinks(Ids) {
      setNoDataFound(false);
      var data = JSON.stringify({ entityIds: Ids });
      var config = {
        method: "post",
        url: "/entity/entity_link",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios(config)
        .then(function (response) {
          if (response.data.length) {
            setApplink(response.data);
          } else {
            setNoDataFound(true);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    var entityData = reducerState.applicationData.applicationElements.filter(
      (x) => x.SYSTEM_CODE === "USCAL"
    );
    if (entityData) {
      let entityIds = entityData
        .map(function (x) {
          return x.EXID;
        })
        .join(",");
      if (entityIds) {
        getAppLinks(entityIds);
      } else {
        setNoDataFound(true);
      }
    }
  }, [reducerState.applicationData.caseTypes]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const handleClickAnchor = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAnchor = () => {
    setAnchorEl(null);
  };

  const handleClickList = (Url) => {
    // setOpen(!open);
    if (Url) {
      window.open(Url, "_blank");
      handleCloseAnchor();
      return;
    }
  };
  return (
    <>
      {applink?.length ? (
        <div className="top-app-drp-list">
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
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
              {/* <ListItemText primary="Application Link" /> */}
              <ListSubheader component="div" id="nested-list-subheader">
                Application Link
              </ListSubheader>
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
            {applink.length
              ? applink.map((applink) => (
                  <StyledMenuItem
                    key={applink.ENTITY_ID}
                    onClick={() => handleClickList(applink.ID)}
                  >
                    <ListItemText primary={applink.ENTITY_ID} />
                  </StyledMenuItem>
                ))
              : []}
          </StyledMenu>
        </div>
      ) : (
        <>
          {noDataFound ? (
            <></>
          ) : (
            <div>
              <Skeleton className={classes.skeletonWidth} />
            </div>
          )}
        </>
      )}
    </>
  );
}

export default ApplicationLinks;
