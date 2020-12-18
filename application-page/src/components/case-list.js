import { Box } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import { fade, makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useState } from "react";
import CasePreview from "./case-preview.js";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    flexGrow: 1,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
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
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
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
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
  },
}));

export default function CaseList(props) {
  const classes = useStyles();
  const [caseIds, setCaseIds] = useState(props.caseIds);
  const [caseId, setCaseId] = useState(0);
  const [caseList, setCaseList] = useState(props.caseListData);

  const handleCasePreviewClick = (id, caseData) => {
    props.handleCasePreviewClick(id, caseData);
    setCaseId(id);
  };

  const handleCaseListData = (caseListData) => {
    setCaseList(caseListData);
  };

  useEffect(() => {
    setCaseList(props.caseListData);
  }, [props.caseIds, props.caseListData]);

  return (
    <Box p={1} className="app-bar-div">
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Box p={1} bgcolor="whitesmoke" className="case-list-div">
        <div className={classes.root} bgcolor="white">
          {caseList
            ? caseList.map((caseData, index) => (
                <CasePreview
                  handleCasePreviewClick={handleCasePreviewClick}
                  caseId={caseData.caseID}
                  caseData={caseData}
                ></CasePreview>
              ))
            : []}
        </div>
      </Box>
    </Box>
  );
}
