import React, { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Popover,
  TextField,
  Toolbar,
} from "@material-ui/core";
import axios from "axios";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { FilterList, RotateLeft } from "@material-ui/icons";
import {
  default as useStyles,
  default as useStylesBase,
} from "../../assets/css/common_styles";
import * as notification from "../common/toast";
import * as API from '../api_base/path-config';
function PeopleDepartmentFilter(props) {
  var classes = useStyles();
  const [value, setValue] = React.useState(0);
  const classesBase = useStylesBase();
  const [anchorEl, setAnchorEl] = React.useState(null);

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

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);

    getDropdownFilters();
    getEmployeeTypeList();
    getCompanyList();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const getDropdownFilters = async (parentName, parentID) => {
    var jsonData = {
      parentName: parentName ? parentName : "",
      parentID: parentID ? parentID : 0,
    };
    var config = {
      method: "post",
      url: API.API_GET_PEOPLE_DEPARTMENT_FILTERS,
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
      url: API.API_GET_PEOPLE_DEPARTMENT_COMPANY_LIST,
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
      url: API.API_GET_PEOPLE_DEPARTMENT_EMPLOYEE_LIST,
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
  const handleFilterResetClick = () => {
    setValue(0);
    props.getDepartmentPeopleList();
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
  const handleFilterSubmit = (event) => {
    event.preventDefault();
    setValue(0);
    props.setCaseListData([]);
    props.setCaseHistoryLogData([]);
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

      props.getDepartmentPeopleList(fields.searchText, 0);
    }
  };
  return (
    <div className="page" id="people-filter">
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
    </div>
  );
}
export default PeopleDepartmentFilter;
