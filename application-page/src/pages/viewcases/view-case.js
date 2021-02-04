import {
  Card,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  Menu,
  MenuItem,
  Select,
  withStyles
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import ListItemText from "@material-ui/core/ListItemText";
import { navigate } from "@reach/router";
import axios from "axios";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useStylesBase from "../../assets/css/common_styles";
import GotoBackButton from "../../components/common/BackButton";
import * as notification from "../../components/common/toast";
import Loading from "../../components/Loader";
import { actionData } from "../../redux/action.js";
import CaseList from "./case-list";
import CaseViewer from "./case_viewer";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const useStyles = makeStyles(
  (theme) => ({
    paper: {
      padding: theme.spacing(1),
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
    },
    fixedHeight: {
      height: "90vh",
      overflow: "auto",
    },
    caseDetails: {
      padding: theme.spacing(2),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }),
  { index: 1 }
);

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function ViewCase(props) {
  const [caseId, setCaseId] = useState(0);
  const [caseData, setCaseData] = useState([]);
  const [caseListData, setCaseListData] = useState([]);
  const [filteredCaseListData, setFilteredCaseListData] = useState([]);
  const [loaded, setLoaded] = useState(true);
  const [maxCount, setMaxCount] = useState(50);
  const [pageSize, setPageSize] = useState(50);
  const [searchTextValue, setSearchTextValue] = useState("");
  const [caseLoaded, setCaseLoaded] = useState(false);
  const [documentList, setDocumentList] = useState([]);
  const [caseFilter, setCaseFilter] = useState(0);
  const timeoutRef = useRef(null);
  const [caseListFiltered, setCaseListFiltered] = useState(false);
  const [componentLoader, setComponentLoader] = useState(false);
  const [caseTypeData, setCaseTypeData] = useState([]);
  const [caseTypeIdValue, setCaseTypeIdValue] = useState(0);
  const [state, setState] = useState(0);
  const [caseTypeId, setCaseTypeId] = useState(0);
  const [labelWidth, setLabelWidth] = React.useState(0);
  const caseTypesByEntityData = useSelector((state) => state);
  const dispatch = useDispatch();

  const inputLabel = React.useRef(null);
  let timeoutVal = 1000; // time it takes to wait for user to stop typing in ms

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [userNameValue, setUserNameValue] = useState(
    props.location?.state?.userName ? props.location?.state?.userName : ""
  );
  const [filterValue, setFilterValue] = useState(
    props.location?.state?.filter ? props.location?.state?.filter : -1
  );
  const [taskCount, setTaskCount] = useState(
    props.location?.state?.taskCount ? props.location?.state?.taskCount : 0
  );

  const [prioritiesData, setPrioritiesData] = useState([]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [selectedStatusData, setSelectedStatusData] = useState([]);

  const handleChangeMultiple = (event, filterName) => {
    if (!caseListFiltered) {
      notification.toast.warning("Please wait...!!");
      return false;
    }
    if (filterName === "pri") {
      setSelectedPriorities(event.target.value);
    } else if (filterName === "status") {
      setSelectedStatusData(event.target.value);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCasePreviewClick = (caseId, caseData) => {
    setCaseId(caseId);
    setCaseData(caseData);
  };

  const handleCaseLoaded = (value) => {
    setCaseLoaded(value);
  };

  const handleDocumentList = (documentList) => {
    setDocumentList(documentList);
  };

  const getFilterValuesByCaseTypeIds = async (caseTypeIds) => {
    var jsonData = {
      caseTypeIds: caseTypeIds,
    };

    var config = {
      method: "post",
      url: "/cases/getFilterValuesByCaseTypeIds",
      data: jsonData,
    };

    await axios(config)
      .then(function (response) {
        // Here Space is require after "PRI" string because space is available in database.
        let priorityData = response.data.filter(
          (x) => x.SYSTEM_CODE === "PRI  "
        );
        if (priorityData) {
          setPrioritiesData(priorityData);
        }
        let statusData = response.data.filter((x) => x.SYSTEM_CODE === "STTUS");
        if (statusData) {
          setStatusData(statusData);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleFilterCaseList = (
    filter,
    isFilterByType = true,
    isCaseListFilterByCaseList = false,
    caseTypeId = 0
  ) => {
    if (!caseListFiltered && filterValue < 0) {
      notification.toast.warning("Please wait...!!");
      return false;
    }
    caseTypeId = caseTypeId ? caseTypeId : caseTypeIdValue;
    setCaseTypeId(caseTypeId);
    setComponentLoader(true);
    setCaseFilter(filter);
    caseList(
      "",
      0,
      false,
      filter,
      isFilterByType,
      isCaseListFilterByCaseList,
      caseTypeId
    );
  };

  const caseList = async (
    searchText = "",
    skipCount = 0,
    loadMore = false,
    filter = 0,
    isFilterByType = false,
    isFilterByCaseType = false,
    caseTypeId = 0
  ) => {
    let userName = userNameValue;
    let caseListFilter = filterValue;

    if (!loadMore && (isFilterByType || isFilterByCaseType)) {
      userName = "";
      caseListFilter = -1;
      setUserNameValue("");
      setFilterValue(-1);
    }

    if (isFilterByCaseType) {
      caseTypeId = Number(caseTypeId);
      setCaseTypeIdValue(caseTypeId);
    }

    if (isFilterByType) {
      setCaseListFiltered(false);
    }
    if (
      loadMore &&
      caseFilter > 0 &&
      (taskCount <= 0 || taskCount === skipCount)
    ) {
      return false;
    }

    if (!loadMore && !isFilterByType && !isFilterByCaseType) {
      setLoaded(false);
      skipCount = 0;
    }

    var jsonData = {
      Username: userName ? userName : "bhaviks",
      TypeId: caseTypeId > 0 ? caseTypeId : caseTypeIdValue,
      PageSize: pageSize,
      MaxCount: maxCount,
      SkipCount: skipCount,
      CurrentPage: 1,
      Ascending: false,
      SortColumn: null,
      Filter: caseListFilter < 0 ? filter : caseListFilter,
      Filters: null,
      TypeIdsForGrouping: null,
    };

    axios
      .post("/cases/GetCaseHeaders", jsonData)
      .then(function (response) {
        setCaseListFiltered(true);
        setCaseListData([]);
        setFilteredCaseListData([]);
        setComponentLoader(false);
        let caseHeadersData = response?.data?.responseContent;

        if (
          caseHeadersData.length &&
          !loadMore &&
          !isFilterByType &&
          (!isFilterByCaseType || caseTypeIdValue == 0)
        ) {
          setCaseListData(caseHeadersData);
          setFilteredCaseListData(caseHeadersData);
          setCaseData(caseHeadersData[0]);
          setCaseId(caseHeadersData[0].caseID);
          setLoaded(true);
        } else if (caseHeadersData.length && loadMore) {
          caseHeadersData = caseListData.concat(caseHeadersData);
          setCaseListData(caseHeadersData);
          setFilteredCaseListData(caseHeadersData);
        } else if (
          caseHeadersData.length &&
          (isFilterByType || isFilterByCaseType)
        ) {
          setCaseListData(caseHeadersData);
          setFilteredCaseListData(caseHeadersData);
        }
        setComponentLoader(false);
        if (taskCount <= maxCount) {
          setUserNameValue("");
          setFilterValue(-1);
        }

        if (filterValue > 0) {
          navigate("tasks", {
            state: { userName: "", filter: -1, taskCount: 0, isParent: false },
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    setComponentLoader(true);
    // Set Is Case Type Available As True
    dispatch(actionData(true, "CASE_TYPE_PROPERTY"));
    let caseTypes = caseTypesByEntityData.applicationData.caseTypes;
    if (caseTypes && caseTypes.length) {
      let caseTypeIds = caseTypes.map((x) => {
        return x.CASE_TYPE_ID;
      });

      let result = caseTypeIds.map((x) => JSON.stringify(x)).join();
      if (filterValue >= 0 && userNameValue) {
        handleFilterCaseList(filterValue, false);
        setCaseListFiltered(true);
      }
      setCaseTypeData(caseTypes);
      setCaseTypeIdValue(caseTypes[0]?.CASE_TYPE_ID);
      if (filterValue && filterValue < 0) {
        setCaseTypeId(caseTypes[0]?.CASE_TYPE_ID);
        caseList("", 0, false, 0, false, true, caseTypes[0]?.CASE_TYPE_ID);
      }
      getFilterValuesByCaseTypeIds(result);
    }
    setLabelWidth(inputLabel.current.offsetWidth);
  }, [caseTypesByEntityData.applicationData.caseTypes]);

  const createLoader = (jsonData) => {
    return <Loading />;
  };

  const onScroll = (caseListData, event) => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
    if (bottom && !searchTextValue) {
      //   alert('bottom');
      caseList("", caseListData?.length, true);
    }
  };

  const classes = useStyles();
  const classesBase = useStylesBase();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const CaseDetailsPaper = clsx(
    classes.paper,
    classes.fixedHeight,
    classes.caseDetails
  );

  const searchCase = (searchText, event) => {
    if (timeoutRef.current !== null) {
      // IF THERE'S A RUNNING TIMEOUT
      clearTimeout(timeoutRef.current); // THEN, CANCEL IT
    }
    if (searchText != "") {
    }

    timeoutRef.current = setTimeout(() => {
      // SET A TIMEOUT
      timeoutRef.current = null; // RESET REF TO NULL WHEN IT RUNS
      if (searchText) {
        setSearchTextValue(searchText);
        setFilteredCaseListData([]);
        getCases(searchText, event);
      } else {
        setSearchTextValue("");
        setFilteredCaseListData(caseListData);
        setCaseListData(caseListData);
      }
    }, timeoutVal);
  };

  const getCases = async (searchText, event) => {
    let currentCaseListData = [...caseListData];

    if (currentCaseListData.length) {
      let filteredCurrentCaseListData = [];
      for (var i = 0; i < currentCaseListData.length; i++) {
        var assignedToFullName = currentCaseListData[i].assignedToFullName
          ? currentCaseListData[i].assignedToFullName.toLowerCase()
          : currentCaseListData[i].assignedTo;
        var caseTitle = currentCaseListData[i].title?.toLowerCase();
        if (
          assignedToFullName.includes(searchText.toLowerCase()) ||
          caseTitle.includes(searchText.toLowerCase())
        ) {
          filteredCurrentCaseListData.push(currentCaseListData[i]);
        }
      }

      if (filteredCurrentCaseListData.length) {
        setFilteredCaseListData(filteredCurrentCaseListData);
      } else {
        setFilteredCaseListData(filteredCurrentCaseListData);
      }
    }
  };

  return (
    <div className="page" id="page-view-case">
      {taskCount ? <GotoBackButton navigateCount={-2} /> : ""}
      <Grid container spacing={0}>
        <Grid
          item
          xs={12}
          sm={1}
          md={1}
          lg={1}
          className="panel-left"
          style={{ marginRight: "1%" }}
        >
          <FormControl
            style={{ width: "-webkit-fill-available" }}
            variant="outlined"
            className={classes.mb_one}
          >
            <InputLabel htmlFor="outlined-filter-native-simple">
              Priority
            </InputLabel>
            <Select
              labelId="demo-mutiple-checkbox-label"
              id="demo-mutiple-checkbox"
              multiple
              value={selectedPriorities}
              onChange={(event) => handleChangeMultiple(event, "pri")}
              input={<Input />}
              label="Priority"
              inputProps={{
                filter: "priority",
                id: "outlined-filter-native-simple",
              }}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {prioritiesData?.length
                ? prioritiesData.map((priority) => (
                    <MenuItem key={priority.NAME} value={priority.NAME}>
                      <Checkbox
                        checked={selectedPriorities.indexOf(priority.NAME) > -1}
                      />
                      <ListItemText primary={priority.NAME} />
                    </MenuItem>
                  ))
                : ""}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={1} md={1} lg={1} style={{ marginRight: "1%" }}>
          <FormControl
            style={{ width: "-webkit-fill-available" }}
            variant="outlined"
            className={classes.mb_one}
          >
            <InputLabel htmlFor="outlined-filter-native-simple">
              Status
            </InputLabel>
            <Select
              labelId="demo-mutiple-checkbox-label"
              id="demo-mutiple-checkbox"
              multiple
              value={selectedStatusData}
              onChange={(event) => handleChangeMultiple(event, "status")}
              input={<Input />}
              label="Status"
              inputProps={{
                filter: "status",
                id: "outlined-filter-native-simple",
              }}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {statusData?.length
                ? statusData.map((status) => (
                    <MenuItem key={status.NAME} value={status.NAME}>
                      <Checkbox
                        checked={selectedStatusData.indexOf(status.NAME) > -1}
                      />
                      <ListItemText primary={status.NAME} />
                    </MenuItem>
                  ))
                : ""}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={1} md={1} lg={1}>
          <FormControl
            style={{ width: "-webkit-fill-available" }}
            className={classes.mb_one}
          >
            <InputLabel htmlFor="outlined-filter-native-simple">
              Assigned To
            </InputLabel>
            <Select
              labelId="filter-label"
              id="filter-select"
              defaultValue={0}
              value={state.filter}
              onChange={(event) => {
                handleFilterCaseList(Number(event.target.value));
              }}
              label="Filter"
              inputProps={{
                filter: "filter",
                id: "outlined-filter-native-simple",
              }}
              fullWidth={true}
            >
              <MenuItem value={0}>All Cases</MenuItem>
              <MenuItem value={1}>Assigned To Me</MenuItem>
              <MenuItem value={2}>Assigned To My Team</MenuItem>
              <MenuItem value={3}>Created By Me</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Card>
        <Grid container spacing={0}>
          {loaded ? (
            <>
              <Grid item xs={12} sm={3} md={3} lg={3} className="panel-left">
                <div
                  className={fixedHeightPaper}
                  onScroll={(event) => onScroll(caseListData, event)}
                >
                  <FormControl
                    variant="outlined"
                    style={{ width: "-webkit-fill-available" }}
                    className={classesBase.mt_one + " " + classesBase.mb_one}
                  >
                    <InputLabel
                      htmlFor="outlined-filter-native-simple"
                      shrink
                      ref={inputLabel}
                    >
                      Case Types
                    </InputLabel>
                    <Select
                      value={caseTypeId}
                      onChange={(event) =>
                        handleFilterCaseList(0, false, true, event.target.value)
                      }
                      label="Case Type"
                      inputProps={{
                        caseTypeId: "caseTypeId",
                        id: "outlined-caseType-native-simple",
                      }}
                      fullWidth={true}
                    >
                      {caseTypeData.length
                        ? caseTypeData.map((option) => (
                            <MenuItem
                              key={option.CASE_TYPE_ID}
                              value={option.CASE_TYPE_ID}
                            >
                              {option.NAME}
                            </MenuItem>
                          ))
                        : []}
                    </Select>
                  </FormControl>
                  <CaseList
                    handleCasePreviewClick={handleCasePreviewClick}
                    handleFilterCaseList={handleFilterCaseList}
                    caseListData={
                      filteredCaseListData.length ? filteredCaseListData : []
                    }
                    caseLoaded={caseLoaded}
                    componentLoader={componentLoader}
                    firstCaseId={caseId}
                  ></CaseList>
                </div>
              </Grid>
              {/* Recent Deposits */}

              {caseId > 0 ? (
                <CaseViewer
                  caseId={caseId}
                  caseData={caseData}
                  handleCaseLoaded={handleCaseLoaded}
                  handleDocumentList={handleDocumentList}
                ></CaseViewer>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
          {!loaded ? createLoader() : []}
        </Grid>
      </Card>
    </div>
  );
}
