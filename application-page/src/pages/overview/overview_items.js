import {
  Box,
  Button,
  Container,
  createMuiTheme,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  responsiveFontSizes,
  Select,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import useStyles from "../../assets/css/common_styles";
import ComponentLoader from "../../components/common/component-loader";
import ActiveEntity from "../../components/react_graph/activeEntity";

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

export default function ItemOverview() {
  var classes = useStyles();
  const reducerState = useSelector((state) => state);
  const [componentLoader, setComponentLoader] = useState(false);
  const [noDataFound, setNoDataFound] = React.useState(false);
  const [entityCount, setEntityCount] = React.useState([]);
  const [statusCount, setStatusCount] = React.useState([]);
  const [categoryCount, setCategoryCount] = React.useState([]);
  const [entityTypes, setEntityTypes] = React.useState([]);
  const [entityListId, setEntityListId] = React.useState("");
  const [state, setState] = useState(0);

  React.useEffect(() => {
    setComponentLoader(true);
    async function getEntityCount(Ids) {
      var data = JSON.stringify({ entityTypeIds: Ids });
      var config = {
        method: "post",
        url: "/entity/entity_count_byId",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios(config)
        .then(function (response) {
          setComponentLoader(false);
          if (response.data.length) {
            setEntityCount(response.data[0]);
            setStatusCount(response.data[1]);
            setCategoryCount(response.data[2]);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    if (entityListId) {
      getEntityCount(entityListId);
    }

    // if (entityListId) {
    // getEntityCount("1215,1452,1454,1460,1462,1461,1463");
    // }

    return () => {};
  }, [entityListId]);
  React.useEffect(() => {
    setComponentLoader(true);
    async function getEntityTypes(Ids) {
      var data = JSON.stringify({ entityIds: Ids });
      var config = {
        method: "post",
        url: "/entity/entity_link",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios(config)
        .then(function (response) {
          // setComponentLoader(false);
          if (response.data.length) {
            setEntityTypes(response.data);
            getSetEntityList(response.data);
          } else {
            setNoDataFound(true);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    var entityData = reducerState.applicationData.applicationElements.filter(
      (x) => x.SYSTEM_CODE === "ASSET"
    );
    if (entityData) {
      let entityIds = entityData
        .map(function (x) {
          return x.EXID;
        })
        .join(",");
      if (entityIds) {
        getEntityTypes(entityIds);
      } else {
        setNoDataFound(true);
      }
    }
  }, [
    reducerState.applicationData.caseTypes,
    reducerState.applicationData.applicationElements,
  ]);

  const getSetEntityList = (entityTypes) => {
    if (entityTypes) {
      let entityIds = entityTypes
        .map(function (x) {
          return x.NAME;
        })
        .join(",");
      if (entityIds) {
        setEntityListId(entityIds);
      } else {
        setNoDataFound(true);
      }
    }
  };
  const handleClickItem = (id) => {
    if (id > 0) {
      setEntityListId(id);
    } else {
      getSetEntityList(entityTypes);
    }
    // setEntityListId(Id);
    // setOpen(!open);
    // if (Id) {
    //   window.open(process.env.REACT_APP_ASSOCIATED_ENTITY_TYPES + Id, "_blank");
    //   return;
    // }
  };

  return (
    <Box
      boxShadow={0}
      className="card bg-secondary"
      color="secondary"
      borderRadius={35}
    >
      <Grid item xs={12} container spacing={3}>
        <Grid item lg={5} md={5} xs={6} sm={6}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">
              {" "}
              Items
            </InputLabel>
            <Select
              className="input-dropdown"
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              label="Items"
              defaultValue={0}
              onChange={(event) => handleClickItem(event.target.value)}
            >
              {entityTypes?.length ? (
                <MenuItem
                  value={0}
                  key="0"
                  onChange={() => getSetEntityList(entityTypes)}
                >
                  <em>All</em>
                </MenuItem>
              ) : (
                []
              )}

              {entityTypes?.length ? (
                entityTypes?.map((entityType) => (
                  <MenuItem key={entityType.NAME} value={entityType.NAME}>
                    {entityType.ID}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value={-1}>
                  <em>No Data Available</em>
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>

        {componentLoader ? (
          <div className={classes.w_100}>
            <ComponentLoader type="rect" />
          </div>
        ) : (
          <>
            {entityCount && statusCount && categoryCount ? (
              <>
                {entityCount.Count > 0 ? (
                  <Grid item lg={12} md={12} xs={12} sm={12}>
                    <div className="st-d-inline">
                      <Typography variant="subtitle2" gutterBottom>
                        {entityCount.Title}
                      </Typography>
                      <Typography
                        variant="h5"
                        gutterBottom
                        // className={classes.h3_text}
                      >
                        {entityCount.Count}
                      </Typography>
                    </div>

                    <Container className={classes.mt_one}>
                      <Grid container spacing={3}>
                        <Grid
                          item
                          lg={12}
                          md={12}
                          xs={12}
                          sm={12}
                          className={classes.activityGraph}
                        >
                          <ActiveEntity entityListId={entityListId} type="" />
                        </Grid>
                      </Grid>
                    </Container>
                  </Grid>
                ) : (
                  <></>
                )}
                {statusCount.Count > 0 ? (
                  <Grid item lg={12} md={12} xs={12} sm={12}>
                    <div className="st-d-inline">
                      <Typography variant="subtitle2" gutterBottom>
                        {statusCount.Title}
                      </Typography>
                      <Typography
                        variant="h5"
                        gutterBottom
                        // className={classes.h3_text}
                      >
                        {statusCount.Count}
                      </Typography>
                    </div>

                    <Container className={classes.mt_one}>
                      <Grid container spacing={3}>
                        <Grid
                          item
                          lg={12}
                          md={12}
                          xs={12}
                          sm={12}
                          className={classes.activityGraph}
                        >
                          <ActiveEntity
                            entityListId={entityListId}
                            type="STTUS"
                          />
                        </Grid>
                      </Grid>
                    </Container>
                  </Grid>
                ) : (
                  <></>
                )}

                {categoryCount.Count > 0 ? (
                  <Grid item lg={12} md={12} xs={12} sm={12}>
                    <div className="st-d-inline">
                      <Typography variant="subtitle2" gutterBottom>
                        {categoryCount.Title}
                      </Typography>
                      <Typography
                        variant="h5"
                        gutterBottom
                        // className={classes.h3_text}
                      >
                        {categoryCount.Count}
                      </Typography>
                    </div>

                    <Container className={classes.mt_one}>
                      <Grid container spacing={3}>
                        {/* <Grid item lg={3} md={3} xs={12} sm={12}>
                        <Typography
                          variant="h3"
                          gutterBottom
                          className={classes.h3_text}
                        >
                          {categoryCount.Count}
                        </Typography>
                      </Grid> */}

                        <Grid
                          item
                          lg={12}
                          md={12}
                          xs={12}
                          sm={12}
                          className={classes.activityGraph}
                        >
                          <ActiveEntity
                            entityListId={entityListId}
                            type="CATEG"
                          />
                        </Grid>
                      </Grid>
                    </Container>
                  </Grid>
                ) : (
                  <>
                    {/* {
                            noDataFound && <>No Data found</>
                            //  ? (
                            //   <>No Data found</>
                            // ) : (
                            //   <div>
                            //     <Skeleton className={classes.skeletonWidth} />
                            //   </div>
                            // )
                          } */}
                  </>
                )}
              </>
            ) : (
              <div style={{ height: "2rem" }}>No Data Found</div>
            )}
          </>
        )}
      </Grid>
    </Box>
  );
}
