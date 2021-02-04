import {
  AppBar,
  Avatar,
  Button,
  Box,
  Card,
  CardHeader,
  Grid,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  TextField,
  Popover,
  InputLabel
} from "@material-ui/core";
import clsx from "clsx";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import axios from "axios";
import { useTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import useStyles from "../../assets/css/common_styles";
import ComponentLoader from "../../components/common/component-loader.js";
import CasePreview from "../../pages/viewcases/case-preview.js";
import * as notification from "../../components/common/toast";
import { navigate } from "@reach/router";
import FilterListIcon from "@material-ui/icons/FilterList";
import useStylesBase from "../../assets/css/common_styles";



const basePath = process.env.REACT_APP_BASE_PATH;


var dateFormat = require("dateformat");

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
        <Box p={3}>
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

export default function PeopleDepartment(props) {
  const theme = useTheme();
  var classes = useStyles();
  const classesBase = useStylesBase();
  const [value, setValue] = React.useState(0);
  const [componentLoader, setComponentLoader] = useState(false);
  const [taskLoader, setTaskLoader] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataInfoLoaded, setInfoDataLoaded] = useState(true);
  const [InfoCall, setInfoCall] = useState(true);
  const [peopleData, setPeopleData] = useState([]);
  const [peopleInfo, setPeopleInfoData] = useState([]);
  const [peopleCases, setPeopleCasesData] = useState([]);
  const [userManager, setUserManager] = React.useState("");
  const [maxCount, setMaxCount] = useState(10);
  const [pageSize, setPageSize] = useState(50);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [state, setState] = React.useState({
    age: '',
    name: 'hai',
  });
  // filter value set

  const [TopFilterValue, setTopFilterValue] = React.useState(0);

  // end filter value set
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
 
  // filter start
  const handleFilterChange = (event, value) => {
    setTopFilterValue(value);
  };
  // filter end
  const GetDepartmentPeopleList = async (searchText = "", skipCount = 0) => {
    setDataLoaded(false);
    setComponentLoader(true);
    var jsonData = {
      maxCount: maxCount + skipCount,
      searchText: searchText,
    };
    var config = {
      method: "post",
      url: "/cases/getDepartmentPeoples",
      data: jsonData,
    };
    await axios(config)
      .then(function (response) {
        setDataLoaded(true);

        setComponentLoader(false);
        if (response.data && InfoCall) {
          setPeopleInfoData(response.data[0]);
          setInfoDataLoaded(false);

          let manager = response.data[0]?.MANAGER_LDAP_PATH;
          if (manager) {
            manager = manager.split("=")[1]?.split(",")[0];

            setUserManager(manager);
          }
        }
        setPeopleData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const GetDepartmentPeopleInfo = async (employee_id) => {
    var jsonData = {
      EMPLOYEE_ID: employee_id,
    };

    var config = {
      method: "post",
      url: "/cases/getPeopleInfo",
      data: jsonData,
    };

    await axios(config)
      .then(function (response) {
        let peopleInfoData = response.data[0];
        setPeopleInfoData(peopleInfoData);
        setInfoDataLoaded(false);
        let manager = peopleInfoData?.MANAGER_LDAP_PATH;
        if (manager) {
          manager = manager.split("=")[1]?.split(",")[0];

          setUserManager(manager);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getPeopleTasks = (peopleInfo) => {
    setTaskLoader(true);
    var jsonData = {
      Ascending: false,
      CurrentPage: 1,
      Filter: 1,
      Filters: null,
      PageSize: pageSize,
      MaxCount: maxCount,
      SkipCount: 0,
      SortColumn: null,
      TypeId: 147, // leading
      TypeIdsForGrouping: null,
      Username: peopleInfo?.SHORT_USER_NAME
        ? peopleInfo?.SHORT_USER_NAME
        : "dixitms",
    };
    axios.post("/cases/GetCaseHeaders", jsonData).then(function (response) {
      let caseHeadersData = response?.data?.responseContent;
      setPeopleCasesData(caseHeadersData);
      setTaskLoader(false);
    });
  };
  useEffect(() => {
    GetDepartmentPeopleList();
  }, []);

  // people image set
  const addDefaultSrc = (event) => {
    let userDefaultImage = require("../../assets/images/default-userimage.png");
    if (userDefaultImage) {
      event.target.src = userDefaultImage;
    }
  };
  const renderUserImage = (fullName) => {
    if (fullName) {
      return (
        <Avatar
          className={classes.large}
          onError={(event) => addDefaultSrc(event)}
          src={process.env.REACT_APP_USER_ICON.concat(fullName)}
          className={classes.avt_large}
        />
      );
    } else {
      return (
        <Avatar
          src="../../assets/images/default-userimage.png"
          className={classes.avt_large}
        />
      );
    }
  };
  const handlePeopleInfo = (employee_id) => {
    setInfoDataLoaded(true);
    setInfoCall(false);
    if (!dataInfoLoaded) {
      GetDepartmentPeopleInfo(employee_id);
    }
  };
  // scroll event to get data onscroll
  const onScroll = (peopleData, event) => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
    if (bottom && dataLoaded) {
      //   alert('bottom');
      GetDepartmentPeopleList("", peopleData?.length, true);
    }
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const renderPeopleImage = (UserName) => {
    if (UserName) {
      return (
        <Avatar
          error
          className={classes.ex_large}
          alt={UserName}
          src={process.env.REACT_APP_USER_ICON + UserName}
        />
      );
    } else {
      return (
        <Avatar
          error
          className={classes.ex_large}
          alt="Test"
          src="https://material-ui.com/static/images/avatar/1.jpg"
        />
      );
    }
  };

  const handleNextClick = () => {
    setComponentLoader(true);
    setPeopleData([]);
  };
  const handleTaskClick = (userName, filter, taskCount) => {
    if (taskCount <= 0) {
      notification.toast.warning("No task available...!!");
      return false;
    }
    navigate("tasks", {
      state: {
        userName: userName,
        filter: filter,
        taskCount: taskCount,
        replace: true,
        isParent: true,
      },
    });
  };
  const handleCasePreviewClick = (id, caseData) => {
    if (id > 0) {
      props.handleCasePreviewClick(id, caseData);
    }
  };
  // popup over
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <div className="page" id="page-department">
      <Grid container spacing={3}>
        <Grid item lg={3} md={4} xs={12} sm={12}>
          <AppBar position="position" className={classes.appBar}>
            <Toolbar>
              <FilterListIcon
                onClick={handleClick}
                style={{ cursor: "pointer" }}
              />
            </Toolbar>
          </AppBar>

          <Popover
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
              <Grid container  className={classesBase.m_one }>
                <Grid item lg={12} md={12} xs={12} sm={12}>
                      <FormControl
                        fullWidth={true}
                        variant="outlined"

                      >
                            <InputLabel id="demo-controlled-open-select-label">Top Level</InputLabel>
                                <Select
                                  native
                                  value={TopFilterValue}
                                  onChange={handleFilterChange}
                                 
                                  inputProps={{
                                    name: "age",
                                    id: "filled-age-native-simple",
                                  }}
                                >
                                  <option aria-label="None" value="" />
                                  <option value={10}>Ten</option>
                                  <option value={20}>Twenty</option>
                                  <option value={30}>Thirty</option>
                                </Select>
                          </FormControl>
                  </Grid>
                  <Grid item lg={12} md={12} xs={12} sm={12}>
                        <FormControl
                          variant="outlined"
                               fullWidth={true}
                         
                        >
                          <InputLabel id="demo-controlled-open-select-label">Job Title</InputLabel>
                          <Select
                            native
                            value={TopFilterValue}
                            onChange={handleFilterChange}
                            inputProps={{
                              name: "age",
                              id: "filled-age-native-simple",
                            }}
                          >
                            <option aria-label="None" value="" />
                            <option value={10}>Ten</option>
                            <option value={20}>Twenty</option>
                            <option value={30}>Thirty</option>
                          </Select>
                        </FormControl>
                </Grid>
                </Grid>
          </Popover>

          <div
            className={fixedHeightPaper}
            onScroll={(event) => onScroll(peopleData, event)}
          >
            <Box boxShadow={0} className="card bg-secondary" borderRadius={5}>
              {peopleData.length ? (
                <>
                  {(componentLoader
                    ? Array.from(new Array(peopleData.length))
                    : peopleData
                  ).map((people, index) => (
                    <Box key={index} width="100%">
                      {people ? (
                        <Card
                          padding={0.5}
                          style={{ cursor: "pointer" }}
                          className={"card-user-case"}
                          onClick={(event) => {
                            handlePeopleInfo(people.EMPLOYEE_ID);
                            getPeopleTasks(people);
                          }}
                        >
                          <CardHeader
                            avatar={renderUserImage(people.FULL_NAME)}
                            title={people.FULL_NAME}
                            subheader={people.DEPARTMENT_NAME}
                          />
                        </Card>
                      ) : (
                        <ComponentLoader type="rect" />
                      )}
                    </Box>
                  ))}
                </>
              ) : (
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
                          <ComponentLoader type="rect" />
                        )}
                      </Box>
                    )
                  )}
                </>
              )}
            </Box>
          </div>
        </Grid>
        <Grid item lg={9} md={8} xs={12} sm={12}>
          {dataInfoLoaded ? (
            <ComponentLoader type="rect" />
          ) : (
            <Grid container spacing={3}>
              <Grid item lg={2} md={3} xs={12} sm={12}>
                <div
                  className="top-section"
                  style={{
                    textAlign: "center",
                    padding: "5px",
                    borderRight: "2px solid #eeeeee",
                  }}
                >
                  {peopleInfo?.FULL_NAME
                    ? renderPeopleImage(peopleInfo.FULL_NAME)
                    : null}
                </div>
              </Grid>
              <Grid item lg={8} md={9} xs={12} sm={12}>
                <Grid container spacing={1}>
                  <Grid item lg={6} md={6} xs={12} sm={12} container>
                    <Grid item lg={4} md={4} xs={4} sm={4}>
                      <Typography color={"primary"}>Name: </Typography>
                    </Grid>
                    <Grid item lg={8} md={8} xs={8} sm={8}>
                      {" "}
                      <Typography>{peopleInfo.FULL_NAME}</Typography>
                    </Grid>
                    <Grid item lg={4} md={4} xs={4} sm={4}>
                      <Typography color={"primary"}>Job: </Typography>
                    </Grid>
                    <Grid item lg={8} md={8} xs={8} sm={8}>
                      {peopleInfo.JOB_TITLE}
                    </Grid>
                    <Grid item lg={4} md={4} xs={4} sm={4}>
                      <Typography color={"primary"}>Department: </Typography>
                    </Grid>
                    <Grid item lg={8} md={8} xs={8} sm={8}>
                      {peopleInfo.DEPARTMENT_NAME}
                      <Typography>IT Department </Typography>
                    </Grid>
                    {peopleInfo?.PHONE_NUMBER ? (
                      <>
                        <Grid item lg={4} md={4} xs={4} sm={4}>
                          <Typography color={"primary"}>
                            Contact Info:{" "}
                          </Typography>
                        </Grid>
                        <Grid item lg={8} md={8} xs={8} sm={8}>
                          <Typography> {peopleInfo?.PHONE_NUMBER}</Typography>
                        </Grid>
                      </>
                    ) : null}

                    <Grid item lg={4} md={4} xs={4} sm={4}>
                      <Typography color={"primary"}>Location: </Typography>
                    </Grid>
                    <Grid item lg={8} md={8} xs={8} sm={8}>
                      {" "}
                      <Typography>
                        {peopleInfo?.CITY + " " + peopleInfo?.STATE}{" "}
                      </Typography>
                    </Grid>
                    <Grid item lg={4} md={4} xs={4} sm={4}>
                      <Typography color={"primary"}>Manager: </Typography>
                    </Grid>
                    <Grid item lg={8} md={8} xs={8} sm={8}>
                      {" "}
                      {userManager ? (
                        <Typography>{userManager}</Typography>
                      ) : (
                        ""
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}

          <div className={classes.mt_one}>
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
                  <Tab className="nav-tab" label="Task" {...a11yProps(1)} />
                  <Tab className="nav-tab" label="Acivity" {...a11yProps(2)} />
                </Tabs>
              </AppBar>
            </Paper>
            <SwipeableViews
              className=""
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={value}
            
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                <Box
                  boxShadow={0}
                  className="card bg-secondary"
                  borderRadius={5}
                >
                  <Grid container>
                    <Grid item xs={6}>
                      {dataInfoLoaded ? (
                        <ComponentLoader type="rect" />
                      ) : (
                        <form className={classes.form_root}>
                          <Grid container spacing={3}>
                            <Grid item xs={6}>
                              <TextField
                                disabled
                                id="outlined-disabled"
                                label="Display Name"
                                defaultValue={peopleInfo.FULL_NAME}
                                InputLabelProps={{
                                  classes: {
                                    root: classes.inputLabel,
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                disabled
                                id="outlined-disabled"
                                label="Legal First Name"
                                defaultValue={peopleInfo.FIRST_NAME}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                disabled
                                id="outlined-disabled"
                                label="Legal Last Name"
                                defaultValue={peopleInfo.LAST_NAME}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                disabled
                                id="outlined-disabled"
                                label="Short User Name"
                                defaultValue={peopleInfo.SHORT_USER_NAME}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                disabled
                                id="outlined-disabled"
                                label="Job Title"
                                defaultValue={peopleInfo.JOB_TITLE}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                disabled
                                id="outlined-disabled"
                                label="Employee Type"
                                defaultValue={peopleInfo.EMPLOYEE_TYPE_NAME}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                disabled
                                id="outlined-disabled"
                                label="Office Street Address"
                                defaultValue={peopleInfo.STREET_ADDRESS}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                disabled
                                id="outlined-disabled"
                                label="Office State"
                                defaultValue={peopleInfo.STATE}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                disabled
                                id="outlined-disabled"
                                label="Office City"
                                defaultValue={peopleInfo.CITY}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                disabled
                                id="outlined-disabled"
                                label="Home Phone/Cell Number"
                                defaultValue={peopleInfo.HOME_PHONE_NUMBER}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                disabled
                                id="outlined-disabled"
                                label="Hire Date"
                                defaultValue={dateFormat(
                                  peopleInfo.HIRE_DATE,
                                  "m/dd/yyyy"
                                )}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                disabled
                                id="outlined-disabled"
                                label="Birth Date"
                                defaultValue={peopleInfo.BIRTH_DATE}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                disabled
                                id="outlined-disabled"
                                label="Gender"
                                defaultValue={
                                  (peopleInfo.GENDER = "M" ? "Male" : "Female")
                                }
                              />
                            </Grid>
                          </Grid>
                        </form>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      {dataInfoLoaded ? (
                        <ComponentLoader type="rect" />
                      ) : (
                        <form className={classes.form_root}>
                          <Grid container spacing={3}>
                            <Grid item xs={6}>
                              <TextField
                                disabled
                                id="outlined-disabled"
                                label="(Preferred) Full Name"
                                defaultValue={peopleInfo.FULL_NAME}
                                InputLabelProps={{
                                  classes: {
                                    root: classes.inputLabel,
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                disabled
                                id="outlined-disabled"
                                label="Email Address"
                                defaultValue={peopleInfo.EMAIL_ADDRESS}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                disabled
                                id="outlined-disabled"
                                label="Department Name"
                                defaultValue={peopleInfo.DEPARTMENT_NAME}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                disabled
                                id="outlined-disabled"
                                label="Office Zip Code"
                                defaultValue={peopleInfo.ZIP_CODE}
                              />
                            </Grid>
                          </Grid>
                        </form>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <Box
                  boxShadow={0}
                  className="card bg-secondary"
                  borderRadius={5}
                >
                  <Grid container spacing={3}>
                    {peopleCases.length ? (
                      <>
                        {(taskLoader
                          ? Array.from(new Array(peopleCases.length))
                          : peopleCases
                        ).map((peopleCase, index) => (
                          <Grid item xs={4}>
                            <Box
                              key={index}
                              width="100%"
                              onClick={(event) => {
                                handleTaskClick(
                                  peopleInfo.SHORT_USER_NAME,
                                  1,
                                  2
                                );
                              }}
                            >
                              {peopleCase ? (
                                <CasePreview
                                  caseId={peopleCase.caseID}
                                  caseData={peopleCase}
                                ></CasePreview>
                              ) : (
                                <ComponentLoader type="rect" />
                              )}
                            </Box>
                          </Grid>
                        ))}
                      </>
                    ) : (
                      <>
                        {taskLoader ? (
                          <>
                            {(taskLoader
                              ? Array.from(new Array(4))
                              : Array(2)
                            ).map((item, index) => (
                              <Grid item xs={4}>
                                <Box key={index} width="100%" padding={0.5}>
                                  {item ? (
                                    <img
                                      style={{ width: "100%", height: 118 }}
                                      alt={item.title}
                                      src={item.src}
                                    />
                                  ) : (
                                    <ComponentLoader type="rect" />
                                  )}
                                </Box>
                              </Grid>
                            ))}
                          </>
                        ) : (
                          <Typography
                            variant="h6"
                            center
                            style={{
                              textAlign: "center",
                              padding: "5px",
                            }}
                          >
                            No Task Found
                          </Typography>
                        )}
                      </>
                    )}
                  </Grid>
                </Box>
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                Activity
              </TabPanel>
            </SwipeableViews>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
