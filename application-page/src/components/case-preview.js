import {
  Card,
  CardActions,
  CardContent,
  Icon,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Typography
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import * as notification from "../components/common/toast";

const useStyles = makeStyles({
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  card: {
    margin: 10,
  },
  listItem: {
    textAlign: "right",
  },
});

export default function CasePreview(props) {
  const classes = useStyles();
  const [caseId, setCaseId] = useState(props.caseId);
  const [caseData, setCaseData] = useState(props.caseData);
  const [caseLoaded, setCaseLoaded] = useState(props.caseLoaded);

  const handleCasePreviewClick = (caseId, caseData) => {
    // props.handleCasePreviewClick(caseId, caseData);
    if (!caseLoaded) {
      notification.toast.warning("Please wait. Your case is loading...!!");
      return false;
    }

    props.handleCasePreviewClick(caseId, caseData);
  };

  useEffect(() => {
    setCaseData(props.caseData);
    setCaseId(props.caseId);
    setCaseLoaded(props.caseLoaded);
  }, [props.caseId, props.caseData, props.caseLoaded]);

  const addDefaultSrc = (event) => {
    let userDefaultImage = require("../assets/images/default-userimage.png");
    if (userDefaultImage) {
      event.target.src = userDefaultImage;
    }
  };

  const renderUserImage = (userName) => {
    if (userName) {
      return (
        <img
          onError={(event) => addDefaultSrc(event)}
          src={
            "http://services.boxerproperty.com/userphotos/DownloadPhoto.aspx?username=" +
            userName
          }
          height={50}
          width={50}
        />
      );
    } else {
      return (
        <img
          src="../assets/images/default-userimage.png"
          height={50}
          width={50}
        />
      );
    }
  };

  return (
    <Card
      style={{ cursor: "pointer" }}
      className={"card-user-case"}
      key={caseData.caseID}
      onClick={(event) => {
        handleCasePreviewClick(caseId, caseData);
      }}
    >
      <CardContent>
        <Typography>{caseData.title}</Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Typography className={classes.title} color="textSecondary">
          {caseData.typeName}
        </Typography>
        <ListItem className={classes.list}>
          <ListItemAvatar></ListItemAvatar>
          <ListItemText
            className={classes.listItem}
            primary={
              caseData.assignedToFullName
                ? caseData.assignedToFullName
                : caseData.assignedTo
            }
          />
          <Icon style={{ marginLeft: "1rem" }} className="s-option-auto-image">
            {renderUserImage(caseData.assignedTo)}
          </Icon>
        </ListItem>
      </CardActions>
    </Card>
  );
}
