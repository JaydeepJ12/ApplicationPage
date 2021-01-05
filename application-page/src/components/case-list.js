import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { fade, makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import CasePreview from "./case-preview.js";
import ComponentLoader from "./common/component-loader.js";

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function CaseList(props) {
  const classes = useStyles();
  const [caseId, setCaseId] = useState(0);
  const [caseList, setCaseList] = useState(props.caseListData);
  const [caseLoaded, setCaseLoaded] = useState(props.caseLoaded);
  const [componentLoader, setComponentLoader] = useState(props.componentLoader);
  const [state, setState] = React.useState(0);

  const handleCasePreviewClick = (id, caseData) => {
    if (id > 0) {
      props.handleCasePreviewClick(id, caseData);
      setCaseId(id);
    }
  };

  const handleCaseListData = (caseListData) => {
    setCaseList(caseListData);
  };

  const handleFilterCaseList = (event) => {
    const filter = Number(event.target.value);
    setState(filter);
    setComponentLoader(true);
    props.handleFilterCaseList(filter);
  };

  useEffect(() => {
    setCaseList(props.caseListData);
    setCaseLoaded(props.caseLoaded);
    setComponentLoader(props.componentLoader);
  }, [props.caseListData, props.caseLoaded, props.componentLoader]);

  return (
    <div className={classes.root}>
      <div className={classes.dropSelect}></div>
      <ComponentLoader componentLoader={componentLoader}></ComponentLoader>
      <FormControl
        style={{ width: "-webkit-fill-available" }}
        variant="outlined"
        className={classes.formControl}
      >
        <InputLabel htmlFor="outlined-filter-native-simple">Filter</InputLabel>
        <Select
          native
          value={state.filter}
          onChange={handleFilterCaseList}
          label="Filter"
          inputProps={{
            filter: "filter",
            id: "outlined-filter-native-simple",
          }}
          fullWidth={true}
        >
          <option value={0}>All Cases</option>
          <option value={1}>Assigned To Me</option>
          <option value={2}>Assigned To My Team</option>
          <option value={3}>Created By Me</option>
        </Select>
      </FormControl>
      {caseList.length ? (
        caseList.map((caseData) => (
          <CasePreview
            handleCasePreviewClick={handleCasePreviewClick}
            caseId={caseData.caseID}
            caseData={caseData}
            caseLoaded={caseLoaded}
          ></CasePreview>
        ))
      ) : (
        <div style={{ height: "2rem" }}>
          {componentLoader ? "Loading please wait..!!" : "No Data Found"}
        </div>
      )}
    </div>
  );
}
