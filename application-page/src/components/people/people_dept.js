import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Popover,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useTheme } from "@material-ui/core/styles";
// table library
import { DataGrid } from "@material-ui/data-grid";
import { FilterList, RotateLeft } from "@material-ui/icons";
import { navigate } from "@reach/router";
import axios from "axios";
import clsx from "clsx";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import SwipeableViews from "react-swipeable-views";
// end table library
import {
  default as useStyles,
  default as useStylesBase
} from "../../assets/css/common_styles";
import ComponentLoader from "../../components/common/component-loader.js";
import * as notification from "../../components/common/toast";
import CasePreview from "../../pages/viewcases/case-preview.js";

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

  // all loading
  const [componentLoader, setComponentLoader] = useState(false);
  const [taskLoader, setTaskLoader] = useState(false);
  const [activityLoader, setActivityLogLoader] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataInfoLoaded, setInfoDataLoaded] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
  // end  all loading

  // all data set
  const [peopleData, setPeopleData] = useState([]);
  const [peopleInfo, setPeopleInfoData] = useState("");
  const [caseListData, setCaseListData] = useState([]);
  const [caseHistoryData, setCaseHistoryLogData] = useState([]);
  const [caseIds, setCaseIds] = useState(0);
  const [userManager, setUserManager] = React.useState("");

  const [recordCount, setRecordCount] = useState(0);
  // end all data set

  // for Filters
  const [maxCount, setMaxCount] = useState(10);
  const [pageSize, setPageSize] = useState(10);
  const [anchorEl, setAnchorEl] = React.useState(null);

  // end for Filters

  // For Fill Dropdown
  const [topLevelDrpData, setTopLevelDrpData] = useState([]);
  const [basicNameDrpData, setBasicNameDrpData] = useState([]);
  const [subDepartmentDrpData, setSubDepartmentDrpData] = useState([]);
  const [jobFunctionDrpData, setJobFunctionDrpData] = useState([]);
  const [jobTitleDrpData, setJobTitleDrpData] = useState([]);
  const [companyDrpData, setCompanyDrpData] = useState([]);
  const [empTypeDrpData, setEmployeeDrpData] = useState([]);

  const [topLevelDrpValue, setTopLevelDrpValue] = useState(0);
  const [basicNameDrpValue, setBasicNameDrpValue] = useState(0);
  const [subDepartmentDrpValue, setSubDepartmentDrpValue] = useState(0);
  const [jobFunctionDrpValue, setJobFunctionDrpValue] = useState(0);
  const [jobTitleDrpValue, setJobTitleDrpValue] = useState(0);
  const [companyDrpValue, setCompanyDrpValue] = useState(0);
  const [empTypeDrpValue, setEmployeeTypeDrpValue] = useState(0);
  const [empStatusDrpValue, setEmployeeStatusDrpValue] = useState("Active");
  const [provisionedDrpValue, setProvisionedDrpValue] = useState("Yes");

  // end For Fill Dropdown

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeightCard);
  const fixedHeightPaperTask = clsx(classes.paper, classes.fixedHeightCard);
  const valueRef = useRef(""); //creating a refernce for TextField Component
  const inputLabel = React.useRef(null);

  // Start  all API call
  const getDepartmentPeopleList = async (searchText = "", skipCount = 0) => {
    setInfoDataLoaded(false);
    setDataLoaded(false);
    setComponentLoader(true);
    setPeopleInfoData("");
    setPeopleData([]);
    setNoDataFound(false);
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
        if (response.data.length) {
          setPeopleInfoData(response.data[0]);
          setInfoDataLoaded(true);

          let manager = response.data[0]?.MANAGER_LDAP_PATH;
          if (manager) {
            manager = manager.split("=")[1]?.split(",")[0];

            setUserManager(manager);
          }
          setPeopleData(response.data);
        } else {
          setNoDataFound(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getDepartmentPeopleInfo = async (employee_id) => {
    setInfoDataLoaded(false);
    setNoDataFound(false);
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
        if (response.data.length) {
          let peopleInfoData = response.data[0];
          setPeopleInfoData(peopleInfoData);
          setInfoDataLoaded(true);
          setNoDataFound(true);
          let manager = peopleInfoData?.MANAGER_LDAP_PATH;
          if (manager) {
            manager = manager.split("=")[1]?.split(",")[0];

            setUserManager(manager);
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getDropdownFilters = async (parentName, parentID) => {
    var jsonData = {
      parentName: parentName ? parentName : "",
      parentID: parentID ? parentID : 0,
    };
    var config = {
      method: "post",
      url: "/cases/getDepartmentEmpFilterValues",
      data: jsonData,
    };
    await axios(config)
      .then(function (response) {
        // for top level dropdown
        let drpTopLevelData = response.data.filter(
          (x) => x.Level === "TOP LEVEL"
        );
        if (drpTopLevelData.length) {
          setTopLevelDrpData(drpTopLevelData);
        }
        // for basic name dropdown
        let drpBasicNameData = response.data.filter(
          (x) => x.Level === "BASIC NAME"
        );
        if (drpBasicNameData.length) {
          setBasicNameDrpData(drpBasicNameData);
        }
        // for SUB DEPARTMENT dropdown
        let drpSubDepartmentData = response.data.filter(
          (x) => x.Level === "SUB DEPARTMENT"
        );
        if (drpSubDepartmentData.length) {
          setSubDepartmentDrpData(drpSubDepartmentData);
        }
        // for JOB FUNCTION dropdown
        let drpJobFunctionData = response.data.filter(
          (x) => x.Level === "JOB FUNCTION"
        );
        if (drpJobFunctionData.length) {
          setJobFunctionDrpData(drpJobFunctionData);
        }
        // for JOB Title dropdown
        let drpJobTitleData = response.data.filter(
          (x) => x.Level === "JOB TITLE"
        );
        if (drpJobTitleData.length) {
          setJobTitleDrpData(drpJobTitleData);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getCompanyList = async () => {
    var config = {
      method: "POST",
      url: "/cases/getCompanyData",
    };
    await axios(config)
      .then(function (response) {
        if (response?.data?.length) {
          setCompanyDrpData(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getEmployeeTypeList = async (searchText = "") => {
    var jsonData = {
      searchText: searchText,
    };
    var config = {
      method: "POST",
      url: "/cases/getEmployeeTypeData",
      data: jsonData,
    };
    await axios(config)
      .then(function (response) {
        if (response?.data?.length) {
          setEmployeeDrpData(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const caseList = async (people, skipCount = 0, loadMore) => {
    setTaskLoader(false);
    setCaseListData([]);
    setCaseIds(0);
    setRecordCount(0);
    var jsonData = {
      Username: people.SHORT_USER_NAME ? people.SHORT_USER_NAME : "dixitms",
      TypeId: 147,
      PageSize: pageSize,
      MaxCount: maxCount,
      SkipCount: skipCount,
      CurrentPage: 1,
      Ascending: false,
      SortColumn: null,
      Filter: 1,
      Filters: null,
      TypeIdsForGrouping: null,
    };

    axios
      .post("/cases/GetCaseHeaders", jsonData)
      .then(function (response) {
        let caseHeadersData = response?.data?.responseContent;
        setRecordCount(caseHeadersData?.length);
        if (caseHeadersData.length && !loadMore) {
          setCaseListData(caseHeadersData);
        } else if (caseHeadersData.length && loadMore) {
          caseHeadersData = caseListData.concat(caseHeadersData);
          setCaseListData(caseHeadersData);
        } else if (caseHeadersData.length) {
          setCaseListData(caseHeadersData);
        }
        setTaskLoader(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const CaseActivityLogList = async (people) => {
    setActivityLogLoader(false);
    setCaseHistoryLogData([]);

    let caseIdList = caseListData?.map((x) => {
      return x.caseID;
    });

    let caseIds = caseIdList?.map((x) => JSON.stringify(x)).join();
    var config = {
      method: "get",
      url: "/cases/case_activity_log?caseIds=" + caseIds,
    };

    axios(config)
      .then(function (response) {
        if (response?.data?.values?.length) {
          setCaseHistoryLogData(response?.data?.values);
          setActivityLogLoader(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  // END   all API call

  // all handle function
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleFilterChange = (parentName, parentID) => {
    handleClearChildOnParentChange(parentName, parentID);
    if (
      parentName == "topLevel" ||
      parentName == "basicName" ||
      parentName == "subDepartment" ||
      parentName == "jobFunction"
    ) {
      getDropdownFilters(parentName, parentID);
    } else {
      handleSetParentDrpValue(parentName, parentID);
    }
  };

  const handleSetParentDrpValue = (parentName, parentValue = "") => {
    switch (parentName) {
      case "jobTitle":
        setJobTitleDrpValue(Number(parentValue));
        break;
      case "employeeStatus":
        setEmployeeStatusDrpValue(parentValue);
        break;
      case "provisioned":
        setProvisionedDrpValue(parentValue);
        break;
      case "company":
        setCompanyDrpValue(Number(parentValue));
        break;
      case "employeeType":
        setEmployeeTypeDrpValue(Number(parentValue));
        break;
      default:
        break;
    }
  };

  const handleClearChildOnParentChange = (parentName, parentId = 0) => {
    switch (parentName) {
      case "topLevel":
        setTopLevelDrpValue(Number(parentId));
        setBasicNameDrpData([]);
        setSubDepartmentDrpData([]);
        setJobFunctionDrpData([]);
        setJobTitleDrpData([]);
        break;
      case "basicName":
        setBasicNameDrpValue(Number(parentId));
        setSubDepartmentDrpData([]);
        setJobFunctionDrpData([]);
        setJobTitleDrpData([]);
        break;
      case "subDepartment":
        setSubDepartmentDrpValue(Number(parentId));
        setJobFunctionDrpData([]);
        setJobTitleDrpData([]);
        break;
      case "jobFunction":
        setJobFunctionDrpValue(Number(parentId));
        setJobTitleDrpData([]);
        break;
      default:
        break;
    }
  };

  const handlePeopleInfo = (employee_id) => {
    setValue(0);
    setInfoDataLoaded(false);
    if (!dataInfoLoaded) {
      notification.toast.warning("Please wait. Your Data is loading...!!");
      return false;
    }
    getDepartmentPeopleInfo(employee_id);
  };
  const handleTaskClick = (userName, filter, taskCount, caseId, caseTypeId) => {
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
        caseId: caseId,
        caseTypeId: caseTypeId,
      },
    });
  };
  const handleOnScroll = (peopleData, event) => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
    if (bottom && dataLoaded) {
      //   alert('bottom');
      getDepartmentPeopleList("", peopleData?.length, true);
    }
  };
  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
    // if (topLevelDrpData.length) {
    //   return false;
    // }
    getDropdownFilters();
    getEmployeeTypeList();
    getCompanyList();
  };
  const handleFilterResetClick = () => {
    setValue(0);
    getDepartmentPeopleList();
    handleFilterClear();
  };

  const handleFilterClear = () => {
    setValue(0);
    setBasicNameDrpData([]);
    setSubDepartmentDrpData([]);
    setJobFunctionDrpData([]);
    setJobTitleDrpData([]);
    setCompanyDrpValue(0);
    setEmployeeTypeDrpValue(0);
    setEmployeeStatusDrpValue("Active");
    setProvisionedDrpValue("Yes");
  };

  const handleClose = () => {
    // alert("--close");
    setAnchorEl(null);
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

    if (bottom && taskLoader && recordCount >= maxCount) {
      caseList(people_info, caseListData?.length, true);
    }
  };
  const handleFilterSubmit = (event) => {
    event.preventDefault();
    setValue(0);
    setCaseListData([]);
    setCaseHistoryLogData([]);
    let fields = {};
    var submitted = true;
    Object.entries(event.target.elements).forEach(([name, input]) => {
      if (input.type != "submit") {
        if (input.name != "" && input.value != "") {
          submitted = true;
          fields[input.name] = input.value;
        }
      }
    });

    if (submitted == true && fields !== undefined) {
      notification.toast.success("Filter Apply successfully..!!!");

      getDepartmentPeopleList(fields.searchText, 0);
    }
  };
  // end all handle function

  useEffect(() => {
    getDepartmentPeopleList();
  }, []);

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
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "case_id", headerName: "Case ID", width: 120 },
    { field: "created_date_time", headerName: "Date and Time", width: 120 },
    { field: "activity_type", headerName: "Activity Type", width: 120 },
    { field: "activity_note", headerName: "Event", width: 300 },
    { field: "created_by", headerName: "User", width: 100 },
    {
      field: "activity_description",
      headerName: "Activity Description",
      width: 300,
    },
    { field: "created_by", headerName: "User", width: 100 },
  ];

  var rows = [];
  if (caseHistoryData.length) {
    for (var i in caseHistoryData) {
      rows.push({
        id: caseHistoryData[i].activity_id,
        case_id: caseHistoryData[i].case_id,
        created_date_time: dateFormat(
          caseHistoryData[i].created_datetime,
          "mm/dd/yyyy h:MM:ss TT"
        ),
        activity_type: caseHistoryData[i].activity_type,
        activity_note: caseHistoryData[i].activity_note,
        created_by: caseHistoryData[i].created_by,
        activity_description: caseHistoryData[i].activity_description,
      });
    }
  }

  return (
    <div className="page" id="page-department">
      <Grid container spacing={3}>
        <Grid item lg={3} md={4} xs={12} sm={12}>
          <AppBar position="position" className={classes.appBar}>
            <Toolbar className="st-inline">
              <div>
                <IconButton
                  className={classes.button}
                  aria-label="filter"
                  onClick={handleFilterClick}
                >
                  <FilterList style={{ cursor: "pointer" }} />
                </IconButton>
                <div className="st-float-end">
                  <IconButton
                    className={classes.button}
                    aria-label="reset"
                    onClick={handleFilterResetClick}
                  >
                    <RotateLeft style={{ cursor: "pointer" }} />
                  </IconButton>
                </div>
              </div>
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
            <Grid className={"card-filter " + classesBase.m_one}>
              <form onSubmit={handleFilterSubmit} className="">
                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <FormControl
                    fullWidth={true}
                    variant="outlined"
                    className={classesBase.mb_one}
                  >
                    <InputLabel id="demo-controlled-open-select-label">
                      Top Level
                    </InputLabel>
                    <Select
                      name="topLevel"
                      className="input-dropdown"
                      label="topLevel"
                      defaultValue={topLevelDrpValue}
                      onChange={(e) =>
                        handleFilterChange("topLevel", e.target.value)
                      }
                    >
                      <MenuItem value="">None</MenuItem>
                      {topLevelDrpData.length
                        ? topLevelDrpData.map((option) => (
                            <MenuItem value={option.ID}>{option.NAME}</MenuItem>
                          ))
                        : []}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <FormControl
                    fullWidth={true}
                    variant="outlined"
                    className={classesBase.mb_one}
                  >
                    <InputLabel id="demo-controlled-open-select-label">
                      Basic Name
                    </InputLabel>
                    <Select
                      className="input-dropdown"
                      name="basicName"
                      label="basicName"
                      defaultValue={basicNameDrpValue}
                      onChange={(e) =>
                        handleFilterChange("basicName", e.target.value)
                      }
                    >
                      {basicNameDrpData.length
                        ? basicNameDrpData.map((option) => (
                            <MenuItem value={option.ID}>{option.NAME}</MenuItem>
                          ))
                        : []}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <FormControl
                    fullWidth={true}
                    variant="outlined"
                    className={classesBase.mb_one}
                  >
                    <InputLabel id="demo-controlled-open-select-label">
                      Sub Department
                    </InputLabel>
                    <Select
                      className="input-dropdown"
                      name="subDepartment"
                      label="subDepartment"
                      defaultValue={subDepartmentDrpValue}
                      onChange={(e) =>
                        handleFilterChange("subDepartment", e.target.value)
                      }
                    >
                      {subDepartmentDrpData.length
                        ? subDepartmentDrpData.map((option) => (
                            <MenuItem value={option.ID}>{option.NAME}</MenuItem>
                          ))
                        : []}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <FormControl
                    fullWidth={true}
                    variant="outlined"
                    className={classesBase.mb_one}
                  >
                    <InputLabel id="demo-controlled-open-select-label">
                      Job Function
                    </InputLabel>
                    <Select
                      className="input-dropdown"
                      name="jobFunction"
                      label="JobFunction"
                      defaultValue={jobFunctionDrpValue}
                      onChange={(e) =>
                        handleFilterChange("jobFunction", e.target.value)
                      }
                    >
                      {jobFunctionDrpData.length
                        ? jobFunctionDrpData.map((option) => (
                            <MenuItem value={option.ID}>{option.NAME}</MenuItem>
                          ))
                        : []}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <FormControl
                    fullWidth={true}
                    variant="outlined"
                    className={classesBase.mb_one}
                  >
                    <InputLabel id="demo-controlled-open-select-label">
                      Job Title
                    </InputLabel>
                    <Select
                      className="input-dropdown"
                      name="jobTitle"
                      label="JobTitle"
                      defaultValue={jobTitleDrpValue}
                      onChange={(e) =>
                        handleFilterChange("jobTitle", e.target.value)
                      }
                    >
                      {jobTitleDrpData.length
                        ? jobTitleDrpData.map((option) => (
                            <MenuItem value={option.ID}>{option.NAME}</MenuItem>
                          ))
                        : []}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <FormControl
                    fullWidth={true}
                    variant="outlined"
                    className={classesBase.mb_one}
                  >
                    <InputLabel id="demo-controlled-open-select-label">
                      Employee Status
                    </InputLabel>
                    <Select
                      className="input-dropdown"
                      name="employeeStatus"
                      label="EmployeeStatus"
                      value={empStatusDrpValue}
                      onChange={(e) =>
                        handleFilterChange("employeeStatus", e.target.value)
                      }
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                      <MenuItem value="both">both</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <FormControl
                    fullWidth={true}
                    variant="outlined"
                    className={classesBase.mb_one}
                  >
                    <InputLabel id="demo-controlled-open-select-label">
                      Provisioned
                    </InputLabel>
                    <Select
                      className="input-dropdown"
                      name="provisioned"
                      label="Provisioned"
                      value={provisionedDrpValue}
                      onChange={(e) =>
                        handleFilterChange("provisioned", e.target.value)
                      }
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">NO</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <FormControl
                    fullWidth={true}
                    variant="outlined"
                    className={classesBase.mb_one}
                  >
                    <InputLabel id="demo-controlled-open-select-label">
                      Company
                    </InputLabel>
                    <Select
                      className="input-dropdown"
                      name="company"
                      label="Company"
                      value={companyDrpValue}
                      onChange={(e) =>
                        handleFilterChange("company", e.target.value)
                      }
                    >
                      <MenuItem aria-label="None" value="" />
                      {companyDrpData.length
                        ? companyDrpData.map((option) => (
                            <MenuItem value={option.COMPANY_ID}>
                              {option.COMPANY_NAME}
                            </MenuItem>
                          ))
                        : []}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <FormControl
                    fullWidth={true}
                    variant="outlined"
                    className={classesBase.mb_one}
                  >
                    <InputLabel id="demo-controlled-open-select-label">
                      Employee Type
                    </InputLabel>
                    <Select
                      className="input-dropdown"
                      name="employeeType"
                      label=" EmployeeType"
                      value={empTypeDrpValue}
                      onChange={(e) =>
                        handleFilterChange("employeeType", e.target.value)
                      }
                    >
                      {empTypeDrpData.length
                        ? empTypeDrpData.map((option) => (
                            <MenuItem value={option.EMPLOYEE_TYPE_ID}>
                              {option.EMPLOYEE_TYPE_NAME}
                            </MenuItem>
                          ))
                        : []}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    id="search"
                    label="Search"
                    name="searchText"
                    placeholder="Search"
                    variant="outlined"
                    className={classesBase.mb_one}
                  />
                </Grid>
                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classesBase.mr_one}
                  >
                    Filter
                  </Button>
                  <Button
                    type="reset"
                    onClick={handleFilterClear}
                    variant="contained"
                    color="secondary"
                  >
                    Clear
                  </Button>
                </Grid>
              </form>
            </Grid>
          </Popover>

          <div
            className={fixedHeightPaper}
            onScroll={(event) => handleOnScroll(peopleData, event)}
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
                          }}
                        >
                          <CardHeader
                            avatar={renderUserImage(people.FULL_NAME)}
                            title={people.FULL_NAME}
                            subheader={people.DEPARTMENT_NAME}
                          />
                        </Card>
                      ) : (
                        <>
                          {noDataFound ? (
                            <div>No Peoples Found </div>
                          ) : (
                            <ComponentLoader type="rect" />
                          )}
                        </>
                      )}
                    </Box>
                  ))}
                </>
              ) : (
                <>
                  {noDataFound ? (
                    <div>No Peoples Found </div>
                  ) : (
                    <ComponentLoader type="rect" />
                  )}
                </>
              )}
            </Box>
          </div>
        </Grid>
        <Grid item lg={9} md={8} xs={12} sm={12}>
          {!dataInfoLoaded ? (
            <Box boxShadow={0} className="card bg-secondary" borderRadius={5}>
              {noDataFound ? (
                <div>No Data Found </div>
              ) : (
                <ComponentLoader type="rect" />
              )}
            </Box>
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
                      <Typography>{peopleInfo?.FULL_NAME}</Typography>
                    </Grid>
                    <Grid item lg={4} md={4} xs={4} sm={4}>
                      <Typography color={"primary"}>Job: </Typography>
                    </Grid>
                    <Grid item lg={8} md={8} xs={8} sm={8}>
                      {peopleInfo?.JOB_TITLE}
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
                  {peopleInfo != "undefined" &&
                  peopleInfo != null &&
                  peopleInfo !== "" ? (
                    <Tab
                      onClick={(event) => {
                        caseList(peopleInfo, 0, false);
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
                    onClick={(event) => {
                      CaseActivityLogList(peopleInfo);
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
                <Box
                  boxShadow={0}
                  className="card bg-secondary"
                  borderRadius={5}
                >
                  <Grid container>
                    {!dataInfoLoaded ? (
                      <>
                        {noDataFound ? (
                          <Grid item xs={12}>
                            No Information Found{" "}
                          </Grid>
                        ) : (
                          <Grid item xs={12}>
                            <ComponentLoader type="rect" />
                          </Grid>
                        )}
                      </>
                    ) : (
                      <>
                        <Grid item xs={6}>
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
                                    (peopleInfo.GENDER = "M"
                                      ? "Male"
                                      : "Female")
                                  }
                                />
                              </Grid>
                            </Grid>
                          </form>
                        </Grid>
                        <Grid item xs={6}>
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
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Box>
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <div
                  className={fixedHeightPaperTask}
                  onScroll={(event) =>
                    handleOnTaskScroll(
                      peopleInfo,
                      caseListData,
                      recordCount,
                      event
                    )
                  }
                >
                  <Box
                    boxShadow={0}
                    className="card bg-secondary"
                    borderRadius={5}
                  >
                    <Grid container spacing={3}>
                      {caseListData?.length ? (
                        <>
                          {(!taskLoader
                            ? Array.from(new Array(caseListData.length))
                            : caseListData
                          ).map((peopleCase, index) => (
                            <Grid item xs={4}>
                              <Box
                                key={index}
                                width="100%"
                                onClick={(event) => {
                                  handleTaskClick(
                                    peopleInfo.SHORT_USER_NAME,
                                    1,
                                    2,
                                    peopleCase.caseID,
                                    peopleCase.typeId
                                  );
                                }}
                              >
                                {peopleCase ? (
                                  <CasePreview
                                    caseId={peopleCase.caseID}
                                    caseData={peopleCase}
                                    firstCaseId={peopleCase.caseID}
                                    isFromPeopleDept={true}
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
                          {!taskLoader ? (
                            <>
                              {(!taskLoader
                                ? Array.from(new Array(3))
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
                </div>
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                {!activityLoader ? (
                  <>
                    {noDataFound ? (
                      <Box
                        boxShadow={0}
                        className="card bg-secondary"
                        borderRadius={5}
                      >
                        <Grid container>
                          <Grid item xs={12}>
                            No Activity Data Found
                          </Grid>
                        </Grid>
                      </Box>
                    ) : (
                      <ComponentLoader type="rect" />
                    )}
                  </>
                ) : (
                  <div style={{ height: 400, width: "100%" }}>
                    <DataGrid rows={rows} columns={columns} pageSize={20} />
                  </div>
                )}
              </TabPanel>
            </SwipeableViews>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
