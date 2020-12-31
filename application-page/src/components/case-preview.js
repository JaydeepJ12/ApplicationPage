import { Icon } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import { default as Typography } from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginBottom: 5,
    backgroundColor: "#ede7f6",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  pos: {
    marginBottom: 12,
  },
  avatar: {
    marginLeft: "auto",
    // border: "2px solid #eee",
    // marginLeft: 10,
    // padding: 1,
  },
  dropSelect: {
    width: "fit-content",
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
  const [expanded, setExpanded] = useState(false);
  const [caseLoaded, setCaseLoaded] = useState(props.caseLoaded);

  const handleCasePreviewClick = (caseId, caseData) => (isExpanded) => {
    // setExpanded(isExpanded ? "panel" : false);
    // props.handleCasePreviewClick(caseId, caseData);
    if(caseLoaded) {
      props.handleCasePreviewClick(caseId, caseData);
    }
  };

  useEffect(() => {
    setCaseData(props.caseData);
    setCaseId(props.caseId);
    setCaseLoaded(props.caseLoaded);
  }, [props.caseId, props.caseData, props.caseLoaded]);

  useEffect(() => {}, [props.caseId, props.caseLoaded]);

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
      className={classes.card}
      key={caseData.caseID}
      onClick={handleCasePreviewClick(caseId, caseData)}
    >
      <CardContent>
        <Typography style={{ cursor: "pointer" }}>{caseData.title}</Typography>
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
