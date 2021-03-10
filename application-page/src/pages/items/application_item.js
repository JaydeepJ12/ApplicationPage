import { Box, Grid, Card, CardHeader, CardContent } from "@material-ui/core";
import axios from "axios";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { default as useStyles } from "../../assets/css/common_styles";
import { useTheme } from "@material-ui/core/styles";
import * as notification from "../../components/common/toast";

import * as API from "../../components/api_base/path-config";
import { useSelector } from "react-redux";
import EntityInfoSection from "./entity_info_section";
import ApplicationItemFilter from "./application_item_filter";
import EntityCard from "./entity_card";
import ComponentLoader from "../../components/common/component-loader";
var dateFormat = require("dateformat");

export default function PeopleDepartment() {
  var classes = useStyles();
  const theme = useTheme();
  // all loading
  const [componentLoader, setComponentLoader] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataInfoLoaded, setInfoDataLoaded] = useState(false);
  const [InfoCardHeaderText, setInfoCardHeaderText] = useState("");
  const [noDataFound, setNoDataFound] = useState(false);

  // all data set
  const [entityList, setEntityList] = useState([]);
  const [entityInfo, setEntityInfo] = useState([]);
  // end all data set

  // for Filters
  const [maxCount, setMaxCount] = useState(10);
  const [entitiesValue, setEntityIds] = useState(0);

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeightCard);

  const reducerState = useSelector((state) => state);
  const entityData = reducerState.applicationData.applicationElements.filter(
    (x) => x.SYSTEM_CODE === "ASSET"
  );

  const getEntityList = async (skipCount = 0, EntityIds, isScroll) => {
    if (!isScroll) {
      setInfoDataLoaded(false);
    }
    setDataLoaded(false);
    setComponentLoader(true);
    setEntityList([]);
    setNoDataFound(false);
    var maxRecord = maxCount + skipCount;
    var config = {
      method: "get",
      url: "/entity/list_by_id?id=" + EntityIds + "&max=" + maxRecord,
    };
    await axios(config)
      .then(function (response) {
        setDataLoaded(true);
        setComponentLoader(false);
        if (response.data.length) {
          if (!isScroll) {
            getEntityInfo(response.data[0].ENTITY_ID);
            setInfoCardHeaderText(response.data[0].Title);
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

    var config = {
      method: "get",
      url: API.API_GET_ENTITY_INFO_BY_ENTITY_ID + "?id=" + entity_id,
    };

    await axios(config)
      .then(function (response) {
        if (response.data.length) {
          setEntityInfo(response.data);

          setInfoDataLoaded(true);
          setNoDataFound(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // end    all API call

  const handleEntityInfo = (entity_id, entity_name) => {
    setInfoCardHeaderText(entity_name);
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
      getEntityList(entityList?.length, entitiesValue, true);
    }
  };

  useEffect(() => {
    if (entityData) {
      let entityIds = entityData
        .map(function (x) {
          return x.EXID;
        })
        .join(",");
      if (entityIds) {
        setEntityIds(entityIds);
        getEntityList(0, entityIds, false);
      }
    }
  }, [reducerState.applicationData.applicationElements]);

  return (
    <div className="page" id="page-department">
      <Grid container spacing={3}>
        <Grid item lg={3} md={4} xs={12} sm={12}>
          <ApplicationItemFilter
            getEntityList={getEntityList}
            setEntityIds={setEntityIds}
            entityData={entityData}
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
              ></EntityCard>
            </Box>
          </div>
        </Grid>
        <Grid item lg={9} md={8} xs={12} sm={12}>
          <Grid container>
            <Grid item xs={12}>
              {!dataInfoLoaded || entityInfo.length <= 0 ? (
                <Box
                  boxShadow={0}
                  className="card bg-secondary"
                  borderRadius={5}
                >
                  <ComponentLoader type="rect" />
                  <ComponentLoader type="rect" />
                </Box>
              ) : (
                <Card className={classes.root} className=" bg-secondary">
                  <CardHeader
                    style={{
                      backgroundColor: theme.palette.primary.main,
                      fontSize: ".9rem",
                    }}
                    title={InfoCardHeaderText ? InfoCardHeaderText : ""}
                  />
                  <CardContent>
                    <EntityInfoSection
                      entityInfoData={entityInfo}
                      noDataFound={noDataFound}
                    ></EntityInfoSection>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
