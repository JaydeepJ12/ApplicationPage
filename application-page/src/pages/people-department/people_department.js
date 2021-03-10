import { Box, Grid } from "@material-ui/core";
import axios from "axios";
import clsx from "clsx";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { default as useStyles } from "../../assets/css/common_styles";
import * as API from "../../components/api_base/path-config";
import * as notification from "../../components/common/toast";
import PeopleBasicInfo from "./people_dept_basic_information";
import PeopleCard from "./people_dept_card";
import PeopleDepartmentFilter from "./people_dept_filter";
import PeopleMainTab from "./people_dept_main_tab";

var dateFormat = require("dateformat");

export default function PeopleDepartment() {
  const reducerState = useSelector((state) => state);
  const appId = reducerState.applicationData.appId;
  var classes = useStyles();
  var [value, setValue] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  // all loading
  const [componentLoader, setComponentLoader] = useState(false);
  const [taskLoader, setTaskLoader] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [filterValue, setFilterData] = useState({});
  const [dataInfoLoaded, setInfoDataLoaded] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
  const [loading, setLoading] = React.useState(false);
  var [navTab, setNavTab] = useState(1);
  // end  all loading

  // all data set
  const [peopleData, setPeopleData] = useState([]);
  const [peopleInfo, setPeopleInfoData] = useState("");
  const [caseListData, setCaseListData] = useState([]);
  const [caseHistoryData, setCaseHistoryLogData] = useState([]);
  const [recordCount, setRecordCount] = useState(0);
  const [peopleCount, setPeopleCount] = useState(0);

  const [caseHistoryRowCount, setTotalCaseHistoryData] = useState(0);
  const [activityFilterValue, setActivityFilterDrpValue] = useState("cases");
  const [searchInput, setSearchInput] = useState({ searchText: "" });
  // end all data set

  // for Filters
  const [maxCount, setMaxCount] = useState(10);
  const [activityLogMaxCount, setActivityLogMaxCount] = useState(100);
  const [pageSize, setPageSize] = useState(10);
  const [gridSkipCount, setGridSkipCount] = useState(0);

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeightCard);

  // Start  all API call
  const getDepartmentPeopleList = async (skipCount = 0, filters, isScroll) => {
    if (filters === undefined) {
      setFilterData({});
    }
    if (!isScroll) {
      setInfoDataLoaded(false);
    }
    setNavTab(0);
    setDataLoaded(false);
    setComponentLoader(true);
    setPeopleData([]);
    setNoDataFound(false);
    var jsonData = {
      maxCount: maxCount + skipCount,
      application_id: appId,
    };
    // this condition to base on api to pass only those filter which will select so it can handle by object merge

    setMaxCount(jsonData.maxCount);

    if (filters !== undefined && filters !== "") {
      if (filters.topLevel !== "" && filters.topLevel !== undefined) {
        Object.assign(jsonData, {
          "DSJT.EMP_DEPARTMENT_TOP_LEVEL": filters.topLevel,
        });
      }
      if (filters.basicName !== "" && filters.basicName !== undefined) {
        Object.assign(jsonData, {
          "DSJT.EMP_DEPARTMENT_BASIC_NAME": filters.basicName,
        });
      }
      if (filters.subDepartment !== "" && filters.subDepartment !== undefined) {
        Object.assign(jsonData, { "DSJT.DEPARTMENT": filters.subDepartment });
      }
      if (filters.jobFunction !== "" && filters.jobFunction !== undefined) {
        Object.assign(jsonData, {
          "DSJT.Emp_JOB_FUNCTION_NAME": filters.jobFunction,
        });
      }
      if (filters.jobTitle !== "" && filters.jobTitle !== undefined) {
        Object.assign(jsonData, {
          "DSJT.Emp_JOB_TITLE_NAME": filters.jobTitle,
        });
      }
      if (filters.company !== "" && filters.company !== undefined) {
        Object.assign(jsonData, { "DSJT.COMPANY_NAME": filters.company });
      }
      if (filters.employeeType !== "" && filters.employeeType !== undefined) {
        Object.assign(jsonData, {
          "EMPT.EMPLOYEE_TYPE_NAME": filters.employeeType,
        });
      }
      if (filters.searchText && filters.searchText !== undefined) {
        Object.assign(jsonData, { "DSJT.EmpDisplayName": filters.searchText });
      }
      if (filters.employee_id && filters.employee_id !== undefined) {
        Object.assign(jsonData, { "DSJT.EMPLOYEEID": filters.employee_id });
      }
      Object.assign(jsonData, {
        empStatus: filters.employeeStatus ? filters.employeeStatus : "active",
      });
      Object.assign(jsonData, {
        provisioned: filters.provisioned ? filters.provisioned : "yes",
      });
    } else {
      Object.assign(jsonData, { employee: "all" });
      Object.assign(jsonData, { provisioned: "yes" });
    }

    var config = {
      method: "post",
      url: API.API_GET_PEOPLE_DEPARTMENTS,
      data: jsonData,
    };

    await axios(config)
      .then(function (response) {
        setDataLoaded(true);
        setComponentLoader(false);
        if (response.data.length) {
          if (!isScroll) {
            setPeopleInfoData(response.data[0]);
            setInfoDataLoaded(true);
          }
          setPeopleCount(response.data.length);

          setPeopleData(response.data);
        } else {
          setNoDataFound(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  // this action use for get department info when card is particular card is click
  const getDepartmentPeopleInfo = async (employee_id) => {
    setInfoDataLoaded(false);
    setNoDataFound(false);
    var jsonData = {
      EMPLOYEE_ID: employee_id,
    };

    var config = {
      method: "post",
      url: API.API_GET_PEOPLE_DEPARTMENT_INFO,
      data: jsonData,
    };

    await axios(config)
      .then(function (response) {
        if (response.data.length) {
          let peopleInfoData = response.data[0];
          setPeopleInfoData(peopleInfoData);
          setInfoDataLoaded(true);
          setNoDataFound(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  // this action use for people case list tab  base on drp Entity and case
  const caseList = async (people, skipCount = 0, loadMore) => {
    setTaskLoader(false);
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
      .post(API.API_GET_PEOPLE_DEPARTMENT_CASES, jsonData)
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
  const handlePageChange = (params) => {
    let isPrev = params.page === page - 1;
    setPage(params.page);
    CaseActivityLogList(activityFilterValue, gridSkipCount, peopleInfo, isPrev);
  };

  // this action use for people all case activity display in   activity tab
  const CaseActivityLogList = async (
    activityFilterValue,
    skipCount = 0,
    people,
    isPrev = false
  ) => {
    // setTotalCaseHistoryData(0);
    setLoading(true);
    if (isPrev) {
      skipCount = gridSkipCount - activityLogMaxCount * 2;
    }
    setRows([]);
    var jsonData = {
      username: people.SHORT_USER_NAME ? people.SHORT_USER_NAME : "dixitms",
      application_type: activityFilterValue,
      skipCount: skipCount,
      maxCount: activityLogMaxCount,
    };
    var config = {
      method: "POST",
      url: API.API_GET_PEOPLE_DEPARTMENT_CASE_ACTIVITY_LOG,
      data: jsonData,
    };

    axios(config)
      .then(function (response) {
        if (response?.data?.data.length) {
          var rows = [];
          var caseHistoryData = response?.data?.data;
          setTotalCaseHistoryData(response?.data?.total);
          if (isPrev) {
            setGridSkipCount(gridSkipCount - activityLogMaxCount);
          } else {
            setGridSkipCount(gridSkipCount + activityLogMaxCount);
          }

          for (var i in caseHistoryData) {
            rows.push({
              id: caseHistoryData[i].ACTIVITY_ID,
              date_time: dateFormat(
                caseHistoryData[i].CREATED_DATETIME,
                "mm/dd/yyyy h:MM TT"
              ),
              case_id: caseHistoryData[i].ID,
              activity_type: caseHistoryData[i].NAME,
              event: caseHistoryData[i].note,
              user: caseHistoryData[i].CREATED_BY,
              activity_description: caseHistoryData[i].DESCRIPTION,
            });
          }

          setRows(rows);
          setLoading(false);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  // end    all API call

  const handlePeopleInfo = (employee_id) => {
    setNavTab(0);
    setValue(0);
    setInfoDataLoaded(false);
    if (!dataInfoLoaded) {
      notification.toast.warning("Please wait. Your Data is loading...!!");
      return false;
    }
    getDepartmentPeopleInfo(employee_id);
  };
  // this scroll action use for scroll a left bar of people to get more data
  const handleOnScroll = (peopleData, event) => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
    if (peopleCount < maxCount) {
      return false;
    }
    if (bottom && dataLoaded) {
      getDepartmentPeopleList(peopleData?.length, filterValue, true);
    }
  };

  useEffect(() => {
    getDepartmentPeopleList();
  }, [reducerState.applicationData.appId]);

  return (
    <div className="page" id="page-department">
      <Grid container spacing={3}>
        <Grid item lg={3} md={4} xs={12} sm={12}>
          <PeopleDepartmentFilter
            setNavTab={setNavTab}
            getDepartmentPeopleList={getDepartmentPeopleList}
            setCaseHistoryLogData={setCaseHistoryLogData}
            setCaseListData={setCaseListData}
            setFilterData={setFilterData}
            setSearchInput={setSearchInput}
            searchInput={searchInput}
            filterValue={filterValue}
            appId={appId}
          ></PeopleDepartmentFilter>
          <div
            className={fixedHeightPaper}
            onScroll={(event) => handleOnScroll(peopleData, event)}
          >
            <Box boxShadow={0} className="card bg-secondary" borderRadius={5}>
              <PeopleCard
                peopleData={peopleData}
                peopleInfo={peopleInfo}
                noDataFound={noDataFound}
                componentLoader={componentLoader}
                handlePeopleInfo={handlePeopleInfo}
              ></PeopleCard>
            </Box>
          </div>
        </Grid>
        <Grid item lg={9} md={8} xs={12} sm={12}>
          <PeopleBasicInfo
            peopleInfo={peopleInfo}
            noDataFound={noDataFound}
            dataInfoLoaded={dataInfoLoaded}
            getDepartmentPeopleList={getDepartmentPeopleList}
            getDepartmentPeopleInfo={getDepartmentPeopleInfo}
          ></PeopleBasicInfo>

          <div className={classes.mt_one}>
            <PeopleMainTab
              peopleInfo={peopleInfo}
              noDataFound={noDataFound}
              dataInfoLoaded={dataInfoLoaded}
              taskLoader={taskLoader}
              SHORT_USER_NAME={peopleInfo.SHORT_USER_NAME}
              caseListData={caseListData}
              caseList={caseList}
              rows={rows}
              loading={loading}
              rowCount={caseHistoryRowCount}
              recordCount={recordCount}
              maxCount={maxCount}
              CaseActivityLogList={CaseActivityLogList}
              activityLogMaxCount={activityLogMaxCount}
              handlePageChange={handlePageChange}
              setActivityFilterDrpValue={setActivityFilterDrpValue}
              activityFilterValue={activityFilterValue}
              navTab={navTab}
              setNavTab={setNavTab}
            ></PeopleMainTab>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
