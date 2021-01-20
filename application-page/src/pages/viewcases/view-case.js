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
import { navigate } from "@reach/router";
import axios from "axios";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useStylesBase from "../../assets/css/common_styles";
import GotoBackButton from "../../components/common/BackButton";
import * as notification from "../../components/common/toast";
import Loading from "../../components/Loader";
import CaseList from "./case-list";
import CaseViewer from "./case_viewer";
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
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

  const caseTypes = async () => {
    setComponentLoader(true);
    await axios.get("/cases/types").then((resp) => {
      setCaseTypeData(resp.data);
      setCaseTypeId(resp.data[0]?.CASE_TYPE_ID);
      caseList("", 0, false, 0, false, true, resp.data[0]?.CASE_TYPE_ID);
    });
  };

  const entitiesByEntityId = async () => {
    setComponentLoader(true);
    let path = window.location.pathname;
    let entityId = 0;
    if (path) {
      entityId = Number(path.split("SearchID=")[1]?.split("/")[0]);
    }

    var jsonData = {
      entityId: entityId,
    };

    var config = {
      method: "post",
      url: "/cases/getEntitiesByEntityId",
      data: jsonData,
    };

    await axios(config)
      .then(function (response) {
        var entityData = response.data.filter((x) => x.SYSTEM_CODE === "ASSCT");

        if (entityData) {
          let entityIds = entityData
            .map(function (x) {
              return x.EXID;
            })
            .join(",");
          if (entityIds) {
            caseTypesByEntityIds(entityIds);
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const caseTypesByEntityIds = async (entityIds) => {
    var jsonData = {
      entityIds: entityIds,
    };

    var config = {
      method: "post",
      url: "/cases/caseTypesByEntityId",
      data: jsonData,
    };

    await axios(config)
      .then(function (response) {
        setCaseTypeData(response.data);
        setCaseTypeId(response.data[0]?.CASE_TYPE_ID);
        caseList("", 0, false, 0, false, true, response.data[0]?.CASE_TYPE_ID);
      })
      .catch(function (error) {
        console.log(error);
      });
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
    let data = caseTypesByEntityData.applicationData.caseTypes;
    if (data.length) {
      if (filterValue >= 0 && userNameValue) {
        handleFilterCaseList(filterValue, false);
        setCaseListFiltered(true);
      }
      setCaseTypeData(data);
      setCaseTypeIdValue(data[0]?.CASE_TYPE_ID);
      if (filterValue && filterValue < 0) {
        setCaseTypeId(data[0]?.CASE_TYPE_ID);
        caseList("", 0, false, 0, false, true, data[0]?.CASE_TYPE_ID);
      }
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
