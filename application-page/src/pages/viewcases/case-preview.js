import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Box,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import useStyles from "../../assets/css/common_styles";
import * as notification from "../../components/common/toast";
import CommonAvatar from "../../components/common/avatar";
export default function CasePreview(props) {
  const classes = useStyles();
  const [caseId, setCaseId] = useState(props.caseId);
  const [caseData, setCaseData] = useState(props.caseData);
  const [caseLoaded, setCaseLoaded] = useState(props.caseLoaded);
  const [firstCaseId, setFirstCaseId] = useState(props.firstCaseId);
  const [isFromPeopleDept, setIsFromPeopleDept] = useState(
    props.isFromPeopleDept ? props.isFromPeopleDept : false
  );

  const handleCasePreviewClick = (caseId, caseData) => {
    if (!isFromPeopleDept) {
      // if (!caseLoaded) {
      //   notification.toast.warning("Please wait. Your case is loading...!!");
      //   return false;
      // }
      setBackGroundColor(caseId);
      props.handleCasePreviewClick(caseId, caseData);
    }
  };

  const setBackGroundColor = (caseId) => {
    var cardDiv = document.getElementById("card-" + caseId);
    var selectedDiv = document.querySelector(".card-background-color");
    if (selectedDiv) {
      selectedDiv.classList.remove("card-background-color");
    }
    if (cardDiv) {
      cardDiv.classList.add("card-background-color");
    }
  };

  useEffect(() => {
    setCaseData(props.caseData);
    setCaseId(props.caseId);
    setCaseLoaded(props.caseLoaded);
    setFirstCaseId(props.firstCaseId);
    setBackGroundColor(props.firstCaseId);
  }, [props.caseId, props.caseData, props.caseLoaded, props.firstCaseId]);

  const addDefaultSrc = (event) => {
    let userDefaultImage = require("../../assets/images/default-userimage.png");
    if (userDefaultImage) {
      event.target.src = userDefaultImage;
    }
  };

  return (
    <Box width="100%" classes={classes.CommonHoverColor}>
      <Card
        padding={0.5}
        style={{ cursor: "pointer" }}
        className={"card-user-case " + classes.mb_one}
        key={caseData.caseID}
        id={"card-" + caseId}
        onClick={(event) => {
          handleCasePreviewClick(caseId, caseData);
        }}
      >
        <CardContent className="st-pb-0">
          <Typography variant="subtitle2">{caseData.title}</Typography>

          <CardActions disableSpacing padding={0} className="st-pt-0">
            <Typography color="textSecondary">{caseData.typeName}</Typography>
            <ListItem className={"st-pt-0"}>
              <ListItemAvatar></ListItemAvatar>
              <ListItemText
                className={classes.listItem}
                primary={
                  caseData.assignedToFullName
                    ? caseData.assignedToFullName
                    : caseData.assignedTo
                }
              />
              <IconButton style={{ marginLeft: "1rem" }} className="st-pt-0">
                <CommonAvatar
                  name={caseData.assignedTo}
                  sizeClass={classes.avt_small}
                />
              </IconButton>
            </ListItem>
          </CardActions>
        </CardContent>
      </Card>
    </Box>
  );
}
