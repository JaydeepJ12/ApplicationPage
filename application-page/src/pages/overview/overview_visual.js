import {
  AppBar,
  Box,
  Button,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { navigate } from "@reach/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SwipeableViews from "react-swipeable-views";
import { default as useStyles } from "../../assets/css/common_styles";
import ComponentLoader from "../../components/common/component-loader.js";
import GraphVisuals from "../../components/react_graph/common_graph";

const basePath = process.env.REACT_APP_BASE_PATH;

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export default function VisualOverview(props) {
  var classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const isParent = props.location?.state?.isParent;
  const [caseTypeData, setCaseTypeData] = useState([]);
  const [caseTypeIds, setCaseTypeIds] = useState([]);
  const reducerState = useSelector((state) => state);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleClick = (props) => {
    navigate(basePath + "/task-select", {
      state: { isParent: true, isChild: false },
    });
  };

  useEffect(() => {
    let caseTypes = reducerState.applicationData.caseTypes;
    if (caseTypes && caseTypes.length) {
      let ids = caseTypes
        .map(function (x) {
          return x.CASE_TYPE_ID;
        })
        .join(",");
      setCaseTypeData(caseTypes);
      setCaseTypeIds(ids);
      setValue(0);
    }
  }, [reducerState.applicationData.caseTypes]);

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  return (
    <div id="page-overview" className="page">
      <Box boxShadow={0} className="card bg-secondary" borderRadius={35}>
        <Grid container>
          <Grid item lg={12} md={12} xs={12} sm={12}>
            {caseTypeData.length ? (
              <div>
                <form>
                  <Button
                    onClick={() => {
                      handleClick();
                    }}
                    variant="contained"
                    size="large"
                    className={
                      classes.mb_one +
                      " btn btn-create-button btn-primary rounded-pill"
                    }
                    variant="contained"
                    color="primary"
                  >
                    + Create
                  </Button>
                </form>
                <Paper elevation={3}>
                  <AppBar position="static" elevation={3}>
                    <Tabs
                      className="nav-tab-list"
                      value={value}
                      onChange={handleChange}
                      indicatorColor="primary"
                      textColor="secondary"
                      variant="fullWidth"
                      aria-label="full width tabs example"
                    >
                      <Tab className="nav-tab" label="All" {...a11yProps(0)} />
                      {caseTypeData.map((caseType) => (
                        <Tab className="nav-tab" label={caseType?.NAME} />
                      ))}
                    </Tabs>
                  </AppBar>
                </Paper>
                <SwipeableViews
                  axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                  index={value}
                  onChangeIndex={handleChangeIndex}
                >
                  <TabPanel value={value} index={0} dir={theme.direction}>
                    {caseTypeData.length ? (
                      <GraphVisuals caseTypes={[caseTypeIds]} />
                    ) : (
                      []
                    )}
                  </TabPanel>
                  {caseTypeData.map((caseType) => (
                    <TabPanel
                      value={caseType?.CASE_TYPE_ID}
                      index={caseType?.CASE_TYPE_ID}
                      dir={theme.direction}
                    >
                      {caseTypeData.length ? (
                        <GraphVisuals caseTypes={[caseType?.CASE_TYPE_ID]} />
                      ) : (
                        []
                      )}
                    </TabPanel>
                  ))}
                </SwipeableViews>
              </div>
            ) : (
              <ComponentLoader type="rect" />
            )}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
