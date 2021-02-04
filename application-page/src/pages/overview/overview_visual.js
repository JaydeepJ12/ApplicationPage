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
import React, { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import GotoBackButton from "../../components/common/BackButton.js";
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
          <div>
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
                  <Tab className="nav-tab" label="Tab" {...a11yProps(1)} />
                  <Tab className="nav-tab" label="Tab" {...a11yProps(2)} />
                </Tabs>
              </AppBar>
            </Paper>
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                Tab-1
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                Tab-2
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                Tab-3
              </TabPanel>
            </SwipeableViews>
          </div>
        </Grid>
      </Grid>
    </Box>
    </div>
  );
}
