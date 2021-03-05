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
import PeopleBasicInfoTab from "./people_dept_information_tab";
import PeopleActivityTab from "./people_dept_activity_tab";
import PeopleTaskTab from "./people_dept_task_tab";

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
  
  useEffect(() => {
  }, [props.peopleInfo],[props.activityFilterValue]);

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

   if(props && props.navTab  === 0){
    value = 0;
   }
  return (
    <div className="page" id="people-parent-tab">
      <Paper className="rounded">
        <AppBar position="static" elevation={4}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="secondary"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab className="nav-tab" label="Info" {...a11yProps(0)} />
            {props.peopleInfo != "undefined" &&
            props.peopleInfo != null &&
            props.peopleInfo !== "" ? (
              <Tab
                onClick={() => {
                  props.setNavTab(1)
                  props.caseList(props.peopleInfo, 0, false);
                }}
                className="nav-tab"
                label="Task"
                {...a11yProps(1)}
              />
            ) : (
              <Tab className="nav-tab" label="Task" {...a11yProps(1)} />
            )}

            <Tab
              className="nav-tab"
              onClick={() => {
                props.setNavTab(2)
                props.CaseActivityLogList(props.activityFilterValue,0, props.peopleInfo,false);
              }}
              label="Acivity"
              {...a11yProps(2)}
            />
          </Tabs>
        </AppBar>
      </Paper>
      <SwipeableViews
        className=""
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <PeopleBasicInfoTab
            dataInfoLoaded={props.dataInfoLoaded}
            noDataFound={props.noDataFound}
            peopleInfo={props.peopleInfo}
          ></PeopleBasicInfoTab>
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
            <PeopleTaskTab
              taskLoader={props.taskLoader}
              SHORT_USER_NAME={props.peopleInfo.SHORT_USER_NAME}
              caseListData={props.caseListData}
            ></PeopleTaskTab>
          </div>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <PeopleActivityTab
            activityLoader={activityLoader}
            noDataFound={props.noDataFound}
            rows={props.rows}
            activityLogMaxCount={props.activityLogMaxCount}
            rowCount={props.rowCount}
            onPageChange={props.handlePageChange}
            loading={props.loading}
            CaseActivityLogList={props.CaseActivityLogList}
            setActivityFilterDrpValue={props.setActivityFilterDrpValue}
            peopleInfo={props.peopleInfo}
            activityFilterValue={props.activityFilterValue}
          ></PeopleActivityTab>
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
export default PeopleMainTab;
