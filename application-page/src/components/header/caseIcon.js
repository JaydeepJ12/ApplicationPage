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
    iconText: "Save Item",
  },
  {
    iconName: "Delete",
    iconText: "Delete Item",
  },
  {
    iconName: "Autorenew",
    iconText: "Refresh",
  },
];

function CaseIcon() {
  const classes = useStyles();
  const [iconDetail, setIconDetail] = React.useState(tempIconDetail);
  return (
    <List style={flexContainer} container>
      {/* <ListItem>
        <div className={classes.cs_icon}>
          <Edit fontSize="large" />
          <Typography variant="subtitle2" gutterBottom>
            Save Item
          </Typography>
        </div>
      </ListItem> */}

      {/* <div className={classes.cs_icon}>
        <Edit fontSize="large" />
        <Typography variant="subtitle2" gutterBottom>
          Edit Item
        </Typography>
      </div>
      <div className={classes.cs_icon}>
        <Delete fontSize="large" />
        <Typography variant="subtitle2" gutterBottom>
          Delete Item
        </Typography>
      </div> */}

      <div className={classes.cs_icon}>
        <IconButton aria-label="delete">
          <Edit fontSize="medium" />
        </IconButton>
        <Typography variant="subtitle2" gutterBottom>
          Edit Item
        </Typography>
      </div>
      <div className={classes.cs_icon}>
        <IconButton aria-label="delete">
          <Delete fontSize="medium" />
        </IconButton>
        <Typography variant="subtitle2" gutterBottom>
          Delete Item
        </Typography>
      </div>
      <div className={classes.cs_icon}>
        <IconButton aria-label="delete">
          <Autorenew fontSize="medium" />
        </IconButton>
        <Typography variant="subtitle2" gutterBottom>
          Refresh
        </Typography>
      </div>
      <div className={classes.cs_icon}>
        <IconButton aria-label="delete">
          <AttachFile fontSize="medium" />
        </IconButton>
        <Typography variant="subtitle2" gutterBottom>
          Attach File
        </Typography>
      </div>
      <div className={classes.cs_icon}>
        <IconButton aria-label="delete">
          <CheckCircleOutline fontSize="medium" />
          <Typography
            variant="subtitle2"
            gutterBottom
            className={classes.icon_mx_width}
          >
            Approve & Return
          </Typography>
        </IconButton>
        <IconButton aria-label="delete" className={classes.pt_zero}>
          <CheckCircleOutline fontSize="medium" />
          <Typography
            variant="subtitle2"
            gutterBottom
            className={classes.icon_mx_width}
          >
            Approve & Assign
          </Typography>
        </IconButton>
      </div>
      {/* <div className={classes.cs_icon}>
        <IconButton aria-label="delete">
          <CheckCircleOutline fontSize="medium" />
          <Typography
            variant="subtitle2"
            gutterBottom
            className={classes.icon_mx_width}
          >
            Decline & Return
          </Typography>
        </IconButton>
        <IconButton aria-label="delete" className={classes.pt_zero}>
          <CheckCircleOutline fontSize="medium" />
          <Typography
            variant="subtitle2"
            gutterBottom
            className={classes.icon_mx_width}
          >
            Decline & Assign
          </Typography>
        </IconButton>
      </div> */}

      {/* <div>
        <IconButton aria-label="delete">
          <CheckCircleOutline fontSize="medium" />
          <Typography variant="subtitle2" gutterBottom>
            Decline & Return
          </Typography>
        </IconButton>
        <IconButton aria-label="delete" className={classes.pt_zero}>
          <CheckCircleOutline fontSize="medium" />
          <Typography variant="subtitle2" gutterBottom>
            Decline & Assign
          </Typography>
        </IconButton>
      </div> */}
      {/* {iconDetail.map((data) => (
        <div className={classes.cs_icon}>
          <IconButton aria-label="delete">
            <Icon>Delete</Icon>
          </IconButton>
          <Typography variant="subtitle2" gutterBottom>
            Refresh
          </Typography>
        </div>
      ))} */}
    </List>
  );
}

export default CaseIcon;
