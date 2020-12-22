import { fade, makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import CasePreview from "./case-preview.js";

const useStyles = makeStyles((theme) => ({
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
    //   width: "fit-content",
  },
  card: {
    margin: 10,
  },
  listItem: {
    textAlign: "right",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

export default function CaseList(props) {
  const classes = useStyles();
  const [caseId, setCaseId] = useState(0);
  const [caseList, setCaseList] = useState(props.caseListData);

  const handleCasePreviewClick = (id, caseData) => {
    if (id > 0) {
      props.handleCasePreviewClick(id, caseData);
      setCaseId(id);
    }
  };

  const handleCaseListData = (caseListData) => {
    setCaseList(caseListData);
  };

  useEffect(() => {
    setCaseList(props.caseListData);
  }, [props.caseListData]);

  return (
    <div className={classes.root}>
      <div className={classes.dropSelect}></div>
      {caseList.length ? (
        caseList.map((caseData) => (
          <CasePreview
            handleCasePreviewClick={handleCasePreviewClick}
            caseId={caseData.caseID}
            caseData={caseData}
          ></CasePreview>
        ))
      ) : (
        <div style={{ height: "2rem" }}>No Data Found</div>
      )}
    </div>
  );
}
