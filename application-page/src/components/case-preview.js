import { Icon } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import { makeStyles } from "@material-ui/core/styles";
import { default as Typography } from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    marginBottom: 5,
  },
  avatar: {
    marginLeft: "auto",
    marginRight: 25
  },
}));

export default function CasePreview(props) {
  const classes = useStyles();
  const [caseId, setCaseId] = useState(props.caseId);
  const [caseData, setCaseData] = useState(props.caseData);
  const [expanded, setExpanded] = useState(false);

  const handleCasePreviewClick = (caseId, caseData) => (isExpanded) => {
    // setExpanded(isExpanded ? "panel" : false);
    props.handleCasePreviewClick(caseId, caseData);
  };

  useEffect(() => {}, [props.caseId, props.caseData]);

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
    <Accordion
      expanded={true}
      onChange={handleCasePreviewClick(caseId, caseData)}
    >
      <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
        <Typography>{caseData.title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          <div style={{ lineHeight: "45px" }}>{caseData.typeName}</div>
        </Typography>
        <Icon style={{ marginLeft: "auto" }} className="s-option-auto-image">
          {renderUserImage(caseData.assignedTo)}
        </Icon>
      </AccordionDetails>
    </Accordion>
  );
}
