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

import EntityMainTab from "./entity_main_tab";
import BasicEntityInfo from "./entity_basic_information";
import ApplicationItemFilter from "./application_item_filter";
import EntityCard from "./entity_card";

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
  const [entityList, setEntityList] = useState([]);
  const [entityInfo, setEntityInfo] = useState("");
  // end all data set

  // for Filters
  const [maxCount, setMaxCount] = useState(10);
  const [activityLogMaxCount, setActivityLogMaxCount] = useState(100);
  const [pageSize, setPageSize] = useState(10);
  const [gridSkipCount, setGridSkipCount] = useState(0);

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeightCard);

  // Start  all API call
  const getEntityList = async (
    searchText = "",
    skipCount = 0,
    isScroll
  ) => {
    if (!isScroll) {
      setInfoDataLoaded(false);
    }
    setDataLoaded(false);
    setComponentLoader(true);
    setEntityList([]);
    setNoDataFound(false);
    var jsonData = {
      maxCount: maxCount + skipCount,
      searchText: searchText,
    };
    var config = {
      method: "post",
      url: '/cases/getDepartmentPeoples',
      data: jsonData,
    };
    await axios(config)
      .then(function (response) {
        setDataLoaded(true);
        setComponentLoader(false);
        if (response.data.length) {
          if (!isScroll) {
            setEntityInfo(response.data[0]);
            setInfoDataLoaded(true);
          }

          setEntityList(response.data);
        } else {
          setNoDataFound(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getEntityInfo = async (entity_id) => {
    setInfoDataLoaded(false);
    setNoDataFound(false);
    var jsonData = {
      EMPLOYEE_ID: entity_id,
    };

    var config = {
      method: "post",
      url: API.API_GET_PEOPLE_DEPARTMENT_INFO,
      data: jsonData,
    };

    await axios(config)
      .then(function (response) {
        if (response.data.length) {
          let entityInfoData = response.data[0];
          setEntityInfo(entityInfoData);
          setInfoDataLoaded(true);
          setNoDataFound(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handlePageChange = (params) => {
    let isPrev = params.page === page - 1;
    setPage(params.page);
  };

  // end    all API call

  const handleEntityInfo = (entity_id) => {
    setNavTab(0)
    setValue(0);
    setInfoDataLoaded(false);
    if (!dataInfoLoaded) {
      notification.toast.warning("Please wait. Your Data is loading...!!");
      return false;
    }
    getEntityInfo(entity_id);
  };
  const handleOnScroll = (entityList, event) => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
    if (bottom && dataLoaded) {
      //   alert('bottom');
      getEntityList("", entityList?.length, true);
    }
  };

  useEffect(() => {
    getEntityList();
  }, []);

  return (
    <div className="page" id="page-department">
      <Grid container spacing={3}>
        <Grid item lg={3} md={4} xs={12} sm={12}>
          <ApplicationItemFilter
            getEntityList={getEntityList}
          ></ApplicationItemFilter>
          <div
            className={fixedHeightPaper}
            onScroll={(event) => handleOnScroll(entityList, event)}
          >
            <Box boxShadow={0} className="card bg-secondary" borderRadius={5}>
              <EntityCard 
              entityList={entityList}
              entityInfo={entityInfo}
              noDataFound={noDataFound}
              componentLoader={componentLoader}
              handleEntityInfo={handleEntityInfo}
              >
              </EntityCard>
            </Box>
          </div>
        </Grid>
        <Grid item lg={9} md={8} xs={12} sm={12}>
          <BasicEntityInfo
            entityInfo={entityInfo}
            noDataFound={noDataFound}
            dataInfoLoaded={dataInfoLoaded}
          ></BasicEntityInfo>

          <div className={classes.mt_one}>
            <EntityMainTab
                  entityInfo={entityInfo}
                  noDataFound={noDataFound}
                  dataInfoLoaded={dataInfoLoaded}
                  loading={loading}
                  maxCount={maxCount}
                  activityLogMaxCount={activityLogMaxCount}
                  handlePageChange={handlePageChange}
                  navTab={navTab}
                  setNavTab={setNavTab}
              ></EntityMainTab>
       
            
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
