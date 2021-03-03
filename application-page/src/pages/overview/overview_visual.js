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
import GotoBackButton from "../../components/common/BackButton.js";
import ComponentLoader from "../../components/common/component-loader.js";
import Example from "../../components/react_graph/common_graph";

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
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const isParent = props.location?.state?.isParent;
  const [caseTypeData, setCaseTypeData] = useState([]);
  const [caseTypeIds, setCaseTypeIds] = useState([]);
  const [dataAvailableCaseTypeIds, setDataAvailableCaseTypeIds] = useState([]);
  const reducerState = useSelector((state) => state);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleClick = (props) => {
    navigate(basePath + "/case-select", {
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
      <GotoBackButton />
      <Box boxShadow={0} className="card bg-secondary" borderRadius={35}>
        <Grid container>
          <Grid
            item
            lg={2}
            md={2}
            xs={12}
            sm={2}
            justify="center"
            className="vertical-center"
          >
            <form>
              <Button
                onClick={() => {
                  handleClick();
                }}
                variant="contained"
                size="large"
                className="btn btn-create-button btn-primary rounded-pill"
                variant="contained"
                color="primary"
              >
                + Create
              </Button>
            </form>
          </Grid>
          <Grid item lg={8} md={8} xs={12} sm={8}>
            {caseTypeData.length ? (
              <div>
                <Paper elevation={3} style={{ width: "fit-content" }}>
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
                      <Example caseTypes={[caseTypeIds]} />
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
                        <Example caseTypes={[caseType?.CASE_TYPE_ID]} />
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
