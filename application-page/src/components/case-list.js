import { FormControl, InputLabel, makeStyles, Select } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import CasePreview from "./case-preview.js";
import ComponentLoader from "./common/component-loader.js";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
// styles
import useStyles from "../assets/css/common_styles";

export default function CaseList(props) {
  var classes = useStyles();
 
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
    <Box>
      <Grid container>
        <FormControl
          style={{ width: "-webkit-fill-available" }}
          variant="outlined"
          className={classes.formControl}
        >
          <InputLabel htmlFor="outlined-filter-native-simple">
            Filter
          </InputLabel>
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
          <>
            {(componentLoader
              ? Array.from(new Array(caseList.length))
              : caseList
            ).map((caseData, index) => (
              <Box key={index} width="100%" padding={0.5}>
                {caseData ? (
                  <CasePreview
                    handleCasePreviewClick={handleCasePreviewClick}
                    caseId={caseData.caseID}
                    caseData={caseData}
                    caseLoaded={caseLoaded}
                  ></CasePreview>
                ) : (
                
                   <ComponentLoader type="rect"/>
                 
                )}
              </Box>
            ))}
          </>
        ) : (
          <>
            {componentLoader ? (
              <>
                {(componentLoader ? Array.from(new Array(4)) : Array(2)).map(
                  (item, index) => (
                    <Box key={index} width="100%" padding={0.5}>
                      {item ? (
                        <img
                          style={{ width: "100%", height: 118 }}
                          alt={item.title}
                          src={item.src}
                        />
                      ) : (
                        <ComponentLoader type="rect"/>
                      )}
                    </Box>
                  )
                )}
              </>
            ) : (
              <Typography variant="h6" center>
                 No Data Found
              </Typography>
            
            )}
          </>
        )}
      </Grid>
    </Box>
  );
}
