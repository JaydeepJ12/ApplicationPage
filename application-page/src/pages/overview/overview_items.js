import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import useStyles from "../../assets/css/common_styles";
import ComponentLoader from "../../components/common/component-loader";
import ActiveEntity from "../../components/react_graph/activeEntity";

export default function ItemOverview() {
  var classes = useStyles();
  const reducerState = useSelector((state) => state);
  const [componentLoader, setComponentLoader] = useState(false);
  const [noDataFound, setNoDataFound] = React.useState(false);
  const [entityCount, setEntityCount] = React.useState({});
  const [entityTypes, setEntityTypes] = React.useState([]);
  const [entityListId, setEntityListId] = React.useState("");
  const [state, setState] = useState(0);

  React.useEffect(() => {
    async function getEntityCount() {
      setComponentLoader(true);
      var config = {
        method: "get",
        url: "/entity/entity_systemcode_count",
      };

      await axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          setComponentLoader(false);
          setEntityCount(response.data[0]);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    getEntityCount();
    return () => {};
  }, []);
  React.useEffect(() => {
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
    reducerState.applicationData.appId,
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
        <Grid
          item
          lg={7}
          md={7}
          xs={12}
          sm={12}
          style={{ "text-align": "right" }}
        >
          <Button
            variant="contained"
            size="large"
            className="btn btn-create-button btn-primary rounded-pill"
            variant="contained"
            color="primary"
          >
            + Add
          </Button>
        </Grid>

        {/* <Grid item lg={12} md={12} xs={12} sm={12}>
          <Typography variant="caption" display="block" gutterBottom>
            COUNT OF ITEMS
          </Typography>
        </Grid> */}
        {componentLoader ? (
          <div className={classes.w_100}>
            <ComponentLoader type="rect" />
          </div>
        ) : (
          <>
            {entityCount ? (
              <>
                {/* <div className={classes.activityGraph}>
              <ActiveEntity />
            </div> */}
                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    COUNT OF ITEMS
                  </Typography>
                  <Container className={classes.mt_one}>
                    <Grid container spacing={3}>
                      <Grid item lg={3} md={3} xs={12} sm={12}>
                        <Typography
                          variant="h3"
                          gutterBottom
                          className={classes.h3_text}
                        >
                          {entityCount.total_count}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        lg={9}
                        md={9}
                        xs={12}
                        sm={12}
                        className={`sm-border-left ` + classes.activityGraph}
                      >
                        <ActiveEntity entityListId={entityListId} />
                      </Grid>
                    </Grid>
                  </Container>
                </Grid>

                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    COUNT OF ITEMS BY STATUS
                  </Typography>
                  <Container className={classes.mt_one}>
                    <Grid container spacing={3}>
                      <Grid item lg={3} md={3} xs={12} sm={12}>
                        <Typography
                          variant="h3"
                          gutterBottom
                          className={classes.h3_text}
                        >
                          {entityCount.sttus_count}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        lg={9}
                        md={9}
                        xs={12}
                        sm={12}
                        className={`sm-border-left `}
                      >
                        <Typography variant="h6" gutterBottom>
                          Status
                        </Typography>
                      </Grid>
                    </Grid>
                  </Container>
                </Grid>
                <Grid item lg={12} md={12} xs={12} sm={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    COUNT OF ITEMS BY CATEGORY
                  </Typography>
                  <Container className={classes.mt_one}>
                    <Grid container spacing={3}>
                      <Grid item lg={3} md={3} xs={12} sm={12}>
                        <Typography
                          variant="h3"
                          gutterBottom
                          className={classes.h3_text}
                        >
                          {entityCount.category_count}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        lg={9}
                        md={9}
                        xs={12}
                        sm={12}
                        className={`sm-border-left `}
                      >
                        <Typography variant="h6" gutterBottom>
                          CATEGORY
                        </Typography>
                      </Grid>
                    </Grid>
                  </Container>
                </Grid>
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
