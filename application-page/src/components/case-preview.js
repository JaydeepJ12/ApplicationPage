import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Typography
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import * as notification from "../components/common/toast";
import useStyles from '../assets/css/common_styles';

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
        <Avatar
        className={classes.large}
          onError={(event) => addDefaultSrc(event)}
          src={
            "http://services.boxerproperty.com/userphotos/DownloadPhoto.aspx?username=" +
            userName
          }
        />
      );
    } else {
      return (
        <Avatar
          src="../assets/images/default-userimage.png"
        />
      );
    }
  };

  return (


    <Card padding={0.5} 
      style={{ cursor: "pointer" }}
      className={"card-user-case"}
      key={caseData.caseID}
      onClick={(event) => {
        handleCasePreviewClick(caseId, caseData);
      }}
    >

      <CardContent className="st-pb-0">
        <Typography variant="subtitle2">{caseData.title}</Typography>

      <CardActions disableSpacing  padding={0} className="st-pt-0"> 
        <Typography   color="textSecondary">
          {caseData.typeName}
        </Typography>
        <ListItem  className={"st-pt-0"}>
          <ListItemAvatar></ListItemAvatar>
          <ListItemText
            className={classes.listItem}
            primary={
              caseData.assignedToFullName
                ? caseData.assignedToFullName
                : caseData.assignedTo
            }
          />
          <IconButton  style={{ marginLeft: "1rem" }}  className="st-pt-0">
            {renderUserImage(caseData.assignedTo)}
          </IconButton>
        </ListItem>
      </CardActions>
      </CardContent>
    </Card>

    
  );
}
