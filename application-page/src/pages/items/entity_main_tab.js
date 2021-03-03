import React, { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Card,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import SwipeableViews from "react-swipeable-views";
import { default as useStyles } from "../../assets/css/common_styles";
import { useTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";


function TabPanel(props) {
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
        <Box p={1} style={{ marginTop: "1rem" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function PeopleMainTab(props) {
  const theme = useTheme();
  var classes = useStyles();
  const fixedHeightPaperTask = clsx(classes.paper, classes.fixedHeight);

  var [value, setValue] = React.useState(0);
  const [activityLoader, setActivityLogLoader] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleOnTaskScroll = (
    people_info,
    caseListData,
    recordCount,
    event
  ) => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;

    if (bottom && props.taskLoader && recordCount >= props.maxCount) {
      props.caseList(people_info, caseListData?.length, true);
    }
  };

  if (props && props.navTab === 0) {
    value = 0;
  }
  return (
    <div className="page" id="people-parent-tab">
      <Paper>
        <AppBar position="static" elevation={1}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="secondary"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab className="nav-tab" label="Info" {...a11yProps(0)} />

            <Tab className="nav-tab" label="Drop Down" {...a11yProps(1)} />

           
          </Tabs>
        </AppBar>
      </Paper>
      <SwipeableViews
        className=""
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <div
            className={fixedHeightPaperTask}
            onScroll={(event) =>
              handleOnTaskScroll(
                props.peopleInfo,
                props.caseListData,
                props.recordCount,
                event
              )
            }
          >
         
          </div>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
         
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
export default PeopleMainTab;
