import {
  Box,
  Grid,
} from "@material-ui/core";
import axios from "axios";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import {
  default as useStyles,
} from "../../assets/css/common_styles";
import * as notification from "../../components/common/toast";

import * as API from '../../components/api_base/path-config';
import PeopleBasicInfo from "./people_dept_basic_information";
import PeopleMainTab from "./people_dept_main_tab";
import PeopleDepartmentFilter from "./people_dept_filter";
import PeopleCard from "./people_dept_card";

var dateFormat = require("dateformat");

export default function PeopleDepartment() {
  var classes = useStyles();
  var [value, setValue] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  // all loading
  const [componentLoader, setComponentLoader] = useState(false);
  const [taskLoader, setTaskLoader] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
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
  const [caseHistoryRowCount, setTotalCaseHistoryData] = useState(0);
  const [activityFilterValue, setActivityFilterDrpValue] = useState("cases");
  // end all data set

  // for Filters
  const [maxCount, setMaxCount] = useState(10);
  const [activityLogMaxCount, setActivityLogMaxCount] = useState(100);
  const [pageSize, setPageSize] = useState(10);
  const [gridSkipCount, setGridSkipCount] = useState(0);

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeightCard);

  // Start  all API call
  const getDepartmentPeopleList = async (
    searchText = "",
    skipCount = 0,
    isScroll
  ) => {
    if (!isScroll) {
      setInfoDataLoaded(false);
    }
    setDataLoaded(false);
    setComponentLoader(true);
    setPeopleData([]);
    setNoDataFound(false);
    var jsonData = {
      maxCount: maxCount + skipCount,
      searchText: searchText,
    };
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
    CaseActivityLogList(gridSkipCount, peopleInfo, isPrev);
  };
  const CaseActivityLogList = async (skipCount = 0, people, isPrev = false) => {
    setTotalCaseHistoryData(0);
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
    setNavTab(0)
    setValue(0);
    setInfoDataLoaded(false);
    if (!dataInfoLoaded) {
      notification.toast.warning("Please wait. Your Data is loading...!!");
      return false;
    }
    getDepartmentPeopleInfo(employee_id);
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

  useEffect(() => {
    getDepartmentPeopleList();
  }, []);

  return (
    <div className="page" id="page-department">
      <Grid container spacing={3}>
        <Grid item lg={3} md={4} xs={12} sm={12}>
          <PeopleDepartmentFilter
            getDepartmentPeopleList={getDepartmentPeopleList}
            setCaseHistoryLogData={setCaseHistoryLogData}
            setCaseListData={setCaseListData}
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
              >
              </PeopleCard>
            </Box>
          </div>
        </Grid>
        <Grid item lg={9} md={8} xs={12} sm={12}>
          <PeopleBasicInfo
            peopleInfo={peopleInfo}
            noDataFound={noDataFound}
            dataInfoLoaded={dataInfoLoaded}
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
                  recordCount={caseHistoryRowCount}
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
