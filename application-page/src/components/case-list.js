import { FormControl, InputLabel, makeStyles, Select, MenuItem } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import CasePreview from "./case-preview.js";
import ComponentLoader from "./common/component-loader.js";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    marginBottom: 5,
    backgroundColor: "#ede7f6",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function CaseList(props) {
  const classes = useStyles();
  const [caseList, setCaseList] = useState(props.caseListData);
  const [caseLoaded, setCaseLoaded] = useState(props.caseLoaded);
  const [componentLoader, setComponentLoader] = useState(props.componentLoader);
  const [state, setState] = React.useState(0);

  const handleCasePreviewClick = (id, caseData) => {
    if (id > 0) {
      props.handleCasePreviewClick(id, caseData);
    }
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
    <div className={"case-user-list " + classes.root}>
      <div className={classes.dropSelect}></div>
      <ComponentLoader componentLoader={componentLoader}></ComponentLoader>
      <FormControl
        style={{ width: "-webkit-fill-available" }}
        className={classes.formControl}
      >
        <InputLabel htmlFor="outlined-filter-native-simple">Filter</InputLabel>
        <Select
          labelId="filter-label"
          id="filter-select"
          value={state.filter}
          value={state.filter}
          onChange={handleFilterCaseList}
          label="Filter"
          inputProps={{
            filter: "filter",
            id: "outlined-filter-native-simple",
          }}
          fullWidth={true}
        >
          <MenuItem  value={0}>All Cases</MenuItem>
          <MenuItem  value={1}>Assigned To Me</MenuItem>
          <MenuItem  value={2}>Assigned To My Team</MenuItem>
          <MenuItem  value={3}>Created By Me</MenuItem>
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
