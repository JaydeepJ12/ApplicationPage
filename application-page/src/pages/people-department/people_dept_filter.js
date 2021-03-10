import {
  AppBar,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Popover,
  TextField,
  Toolbar
} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import { FilterList, RotateLeft } from "@material-ui/icons";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import React, { useRef, useState } from "react";
import {
  default as useStyles,
  default as useStylesBase
} from "../../assets/css/common_styles";
import * as API from "../../components/api_base/path-config";
import * as notification from "../../components/common/toast";
import headerStyles from "../../components/header/header_styles";
function PeopleDepartmentFilter(props) {
  var classes = useStyles();
  const [value, setValue] = React.useState(0);
  const classesBase = useStylesBase();
  const sharedClasses = headerStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  // For Fill Dropdown
  const [topLevelDrpData, setTopLevelDrpData] = useState([]);
  const [basicNameDrpData, setBasicNameDrpData] = useState([]);
  const [subDepartmentDrpData, setSubDepartmentDrpData] = useState([]);
  const [jobFunctionDrpData, setJobFunctionDrpData] = useState([]);
  const [jobTitleDrpData, setJobTitleDrpData] = useState([]);
  const [companyDrpData, setCompanyDrpData] = useState([]);
  const [empTypeDrpData, setEmployeeDrpData] = useState([]);

  const [topLevelDrpValue, setTopLevelDrpValue] = useState("");
  const [basicNameDrpValue, setBasicNameDrpValue] = useState("");
  const [subDepartmentDrpValue, setSubDepartmentDrpValue] = useState("");
  const [jobFunctionDrpValue, setJobFunctionDrpValue] = useState("");
  const [jobTitleDrpValue, setJobTitleDrpValue] = useState("");
  const [companyDrpValue, setCompanyDrpValue] = useState("");
  const [empTypeDrpValue, setEmployeeTypeDrpValue] = useState("");
  const [empStatusDrpValue, setEmployeeStatusDrpValue] = useState("active");
  const [provisionedDrpValue, setProvisionedDrpValue] = useState("yes");

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const timeoutRef = useRef(null);
  let timeoutVal = 1000; // time it takes to wait for user to stop typing in ms

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
      entityId: props.appId,
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
          (x) => x.Level === "TOP LEVEL"
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

  const handleFilterChange = (is_split, parentName, parentID) => {
    var value = "";
    var split_value = parentID;
    if (is_split) {
      parentID = parentID.split("@")[0];
      value = split_value.split("@")[1];
    }
    handleClearChildOnParentChange(value, parentName, parentID);
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
  const handleClearChildOnParentChange = (value, parentName, parentId = 0) => {
    switch (parentName) {
      case "topLevel":
        setTopLevelDrpValue(parentId + "@" + value);
        setBasicNameDrpData([]);
        setSubDepartmentDrpData([]);
        setJobFunctionDrpData([]);
        setJobTitleDrpData([]);
        break;
      case "basicName":
        setBasicNameDrpValue(parentId + "@" + value);
        setSubDepartmentDrpData([]);
        setJobFunctionDrpData([]);
        setJobTitleDrpData([]);
        break;
      case "subDepartment":
        setSubDepartmentDrpValue(parentId + "@" + value);
        setJobFunctionDrpData([]);
        setJobTitleDrpData([]);
        break;
      case "jobFunction":
        setJobFunctionDrpValue(parentId + "@" + value);
        setJobTitleDrpData([]);
        break;
      default:
        break;
    }
  };
  const handleSetParentDrpValue = (parentName, parentValue = "") => {
    switch (parentName) {
      case "jobTitle":
        setJobTitleDrpValue(parentValue);
        break;
      case "employeeStatus":
        setEmployeeStatusDrpValue(parentValue);
        break;
      case "provisioned":
        setProvisionedDrpValue(parentValue);
        break;
      case "company":
        setCompanyDrpValue(parentValue);
        break;
      case "employeeType":
        setEmployeeTypeDrpValue(parentValue);
        break;

      default:
        break;
    }
  };
  const handleFilterResetClick = () => {
    props.setNavTab(0);
    props.setFilterData({});
    props.setSearchInput({ searchText: "" });
    props.getDepartmentPeopleList();
    handleFilterClear();
  };

  const handleFilterClear = () => {
    setValue(0);
    setBasicNameDrpData([]);
    setSubDepartmentDrpData([]);
    setJobFunctionDrpData([]);
    setJobTitleDrpData([]);
    setCompanyDrpValue([]);
    setEmployeeTypeDrpValue([]);
    setEmployeeStatusDrpValue("active");
    setProvisionedDrpValue("yes");
    props.getDepartmentPeopleList();
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    setValue(0);
    props.setNavTab(0);
    props.setCaseListData([]);
    props.setCaseHistoryLogData([]);

    let fields = {};
    var submitted = true;
    Object.entries(event.target.elements).forEach(([name, input]) => {
      if (input.type != "submit") {
        if (input.name !== "" && input.value !== "") {
          submitted = true;
          fields[input.name] = input.value;
          if (input.value.includes("@") && input.name !== "searchText") {
            fields[input.name] = input.value.split("@")[1];
          }
        }
      }
    });
    props.setFilterData(fields);
    if (submitted == true && fields !== undefined) {
      notification.toast.success("Filter Apply successfully..!!!");

      props.getDepartmentPeopleList(0, fields, 0);
    }
  };

  const searchPeople = (searchText) => {
    props.setSearchInput({ searchText: searchText });
    if (timeoutRef.current !== null) {
      // IF THERE'S A RUNNING TIMEOUT
      clearTimeout(timeoutRef.current); // THEN, CANCEL IT
    }

    timeoutRef.current = setTimeout(() => {
      // SET A TIMEOUT
      timeoutRef.current = null; // RESET REF TO NULL WHEN IT RUNS
      if (searchText) {
        props.filterValue.searchText = searchText;
        props.getDepartmentPeopleList(0, props.filterValue, 0);
      } else {
        props.getDepartmentPeopleList();
      }
    }, timeoutVal);
  };
  return (
    <div className="page" id="people-filter">
      <AppBar position="position" className={classes.appBar}>
        <Toolbar className="st-contents">
          <div>
            <IconButton
              className={classes.button}
              aria-label="filter"
              onClick={handleFilterClick}
            >
              <FilterList style={{ cursor: "pointer" }} />
            </IconButton>
            <FormControl
              variant="outlined"
              className={classes.mt_one + " " + classes.mb_one}
            >
              <div
                className={
                  sharedClasses.search + " " + sharedClasses.searchFocused
                }
              >
                <div className={sharedClasses.searchIconOpened}>
                  <IconButton className={sharedClasses.headerMenuButton}>
                    <SearchIcon className={sharedClasses.headerIcon} />
                  </IconButton>
                </div>
                <InputBase
                  name="searchInput"
                  value={props.searchInput.searchText}
                  onInput={(event) => searchPeople(event.target.value)}
                  placeholder="Search By Name.."
                />
              </div>
            </FormControl>
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
                    handleFilterChange(true, "topLevel", e.target.value)
                  }
                >
                  {topLevelDrpData.length
                    ? topLevelDrpData.map((option) => (
                        <MenuItem value={option.ID + "@" + option.NAME}>
                          {option.NAME}
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
                  Basic Name
                </InputLabel>
                <Select
                  className="input-dropdown"
                  name="basicName"
                  label="basicName"
                  defaultValue={basicNameDrpValue}
                  onChange={(e) =>
                    handleFilterChange(true, "basicName", e.target.value)
                  }
                >
                  {basicNameDrpData.length
                    ? basicNameDrpData.map((option) => (
                        <MenuItem value={option.ID + "@" + option.NAME}>
                          {option.NAME}
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
                  Sub Department
                </InputLabel>
                <Select
                  className="input-dropdown"
                  name="subDepartment"
                  label="subDepartment"
                  defaultValue={subDepartmentDrpValue}
                  onChange={(e) =>
                    handleFilterChange(true, "subDepartment", e.target.value)
                  }
                >
                  {subDepartmentDrpData.length
                    ? subDepartmentDrpData.map((option) => (
                        <MenuItem value={option.ID + "@" + option.NAME}>
                          {option.NAME}
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
                  Job Function
                </InputLabel>
                <Select
                  className="input-dropdown"
                  name="jobFunction"
                  label="JobFunction"
                  defaultValue={jobFunctionDrpValue}
                  onChange={(e) =>
                    handleFilterChange(true, "jobFunction", e.target.value)
                  }
                >
                  {jobFunctionDrpData.length
                    ? jobFunctionDrpData.map((option) => (
                        <MenuItem value={option.ID + "@" + option.NAME}>
                          {option.NAME}
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
                  Job Title
                </InputLabel>
                <Select
                  className="input-dropdown"
                  name="jobTitle"
                  label="JobTitle"
                  defaultValue={jobTitleDrpValue}
                  onChange={(e) =>
                    handleFilterChange(true, "jobTitle", e.target.value)
                  }
                >
                  {jobTitleDrpData.length
                    ? jobTitleDrpData.map((option) => (
                        <MenuItem value={option.ID + "@" + option.NAME}>
                          {option.NAME}
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
                  Employee Status
                </InputLabel>
                <Select
                  className="input-dropdown"
                  name="employeeStatus"
                  label="EmployeeStatus"
                  value={empStatusDrpValue}
                  onChange={(e) =>
                    handleFilterChange(false, "employeeStatus", e.target.value)
                  }
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">InActive</MenuItem>
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
                    handleFilterChange(false, "provisioned", e.target.value)
                  }
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">NO</MenuItem>
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
                    handleFilterChange(false, "company", e.target.value)
                  }
                >
                  <MenuItem aria-label="None" value="" />
                  {companyDrpData.length
                    ? companyDrpData.map((option) => (
                        <MenuItem
                          value={option.COMPANY_ID + "@" + option.COMPANY_NAME}
                        >
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
                    handleFilterChange(false, "employeeType", e.target.value)
                  }
                >
                  {empTypeDrpData.length
                    ? empTypeDrpData.map((option) => (
                        <MenuItem
                          value={
                            option.EMPLOYEE_TYPE_ID +
                            "@" +
                            option.EMPLOYEE_TYPE_NAME
                          }
                        >
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
                type="text"
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
