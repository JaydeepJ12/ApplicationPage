import React from "react";
import {
  Avatar,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Grid,
} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import {
  Memory,
  Save,
  Edit,
  Delete,
  Autorenew,
  AttachFile,
  CheckCircleOutline,
  HighlightOff,
  Link,
  Assignment,
  Ballot,
  ChromeReaderMode,
  Description,
  Forward,
  ListAlt,
  PictureAsPdf,
  Receipt,
  LowPriority,
} from "@material-ui/icons";
import useStyles from "../../assets/css/common_styles";
const flexContainer = {
  display: "flex",
  flexDirection: "row",
  padding: 0,
};

const tempIconDetail = [
  {
    iconName: "Edit",
    Icon: <Edit />,
    iconText: "Save Item",
  },
  {
    iconName: "Delete",
    Icon: <Delete />,
    iconText: "Delete Item",
  },
  {
    iconName: "Autorenew",
    Icon: <Autorenew />,
    iconText: "Refresh",
  },
  {
    iconName: "AttachFile",
    Icon: <AttachFile />,
    iconText: "Attach File",
  },
];

const temp2IconDetail = [
  {
    iconName: "Link",
    Icon: <Link />,
    iconText: "Copy Link",
  },
  {
    iconName: "Assignment",
    Icon: <Assignment />,
    iconText: "Task Ownership",
  },
  {
    iconName: "Forward",
    Icon: <Forward />,
    iconText: "Assign Item",
  },
  {
    iconName: "AttachFile",
    Icon: <ChromeReaderMode />,
    iconText: "Unassign Item",
    dis: "yes",
  },

  {
    iconName: "LowPriority",
    Icon: <LowPriority />,
    iconText: "Forward Item",
  },

  {
    iconName: "Forward",
    Icon: <Forward />,
    iconText: "Assign To",
  },

  {
    iconName: "ListAlt",
    Icon: <ListAlt />,
    iconText: "Activity Log",
  },
  {
    iconName: "PictureAsPdf",
    Icon: <PictureAsPdf />,
    iconText: "Export To PDF",
    dis: "yes",
  },
  {
    iconName: "Receipt",
    Icon: <Receipt />,
    iconText: "Documents",
  },
];

function CaseIcon() {
  const classes = useStyles();
  const [iconDetail, setIconDetail] = React.useState(tempIconDetail);
  const [icon2Detail, setIcon2Detail] = React.useState(temp2IconDetail);
  return (
    <div>
      <Grid container>
        <Grid item lg={3} md={4} sm={6} xs={12} className="st-d-inline">
          {iconDetail.map((data) => (
            <div className={classes.cs_icon}>
              <IconButton
                aria-label="delete"
                onClick={(e) => {
                  alert(e.currentTarget);
                }}
                disabled={data.dis && true}
              >
                {data.Icon}
              </IconButton>
              <Typography variant="subtitle2" gutterBottom>
                {data.iconText}
              </Typography>
            </div>
          ))}
        </Grid>
        <Grid item lg={3} md={6} sm={6} xs={12} className="st-d-inline">
          {/* <Grid item lg={4} md={6} sm={6} xs={12} className="st-d-inline"> */}
          <div className="d-grid">
            <IconButton aria-label="delete" className={classes.pt_zero}>
              <CheckCircleOutline fontSize="medium" />
              <Typography variant="subtitle2" gutterBottom>
                Approve & Return
              </Typography>
            </IconButton>
            <IconButton aria-label="delete" className={classes.pt_zero}>
              <CheckCircleOutline fontSize="medium" />
              <Typography variant="subtitle2" gutterBottom>
                Approve & Assign
              </Typography>
            </IconButton>
          </div>
          <div className="d-grid">
            <IconButton
              aria-label="delete"
              onClick={(e) => {
                alert(e.currentTarget);
              }}
              className={classes.pt_zero}
            >
              <HighlightOff fontSize="medium" />
              <Typography variant="subtitle2" gutterBottom>
                Decline & Return
              </Typography>
            </IconButton>
            <IconButton aria-label="delete" className={classes.pt_zero}>
              <HighlightOff fontSize="medium" />
              <Typography variant="subtitle2" gutterBottom>
                Decline & Assign
              </Typography>
            </IconButton>
          </div>
        </Grid>
        <Grid item lg={6} md={12} sm={12} xs={12} className="st-d-inline">
          {icon2Detail.map((data) => (
            <div className={classes.cs_icon}>
              <IconButton
                aria-label="delete"
                onClick={(e) => {
                  alert(e.currentTarget);
                }}
                disabled={data.dis && true}
              >
                {data.Icon}
              </IconButton>
              <Typography variant="subtitle2" gutterBottom>
                {data.iconText}
              </Typography>
            </div>
          ))}
        </Grid>
      </Grid>
    </div>
  );
}

export default CaseIcon;
