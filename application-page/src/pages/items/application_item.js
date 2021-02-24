import React, { useEffect, useState } from "react";
import axios from "axios";
import clsx from "clsx";
import {
  AppBar,
  Box,
  Button,
  Grid,
  IconButton,
  InputLabel,
  FormControl,
  MenuItem,
  Popover,
  Toolbar,
  Avatar,
  Card,
  CardHeader,
} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import { FilterList, RotateLeft } from "@material-ui/icons";
import { useSelector } from "react-redux";
import ComponentLoader from "../../components/common/component-loader";
import {
  default as useStyles,
  default as useStylesBase,
} from "../../assets/css/common_styles";
import { useTheme } from "@material-ui/core";

import PeopleMainTab from "./main_tab";
import * as API from "../../components/api_base/path-config";
export default function ApplicationItem() {
  const classes = useStyles();
  const classesBase = useStylesBase();
  const theme = useTheme();

  const reducerState = useSelector((state) => state);
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);
  const [entityData, setEntityData] = useState([]);
  const [entityTypes, setEntityTypes] = useState(0);
  const [noDataFound, setNoDataFound] = useState(false);
  const [entityDrpValue, setEntityTypeValue] = useState(0);
  const [componentLoader, setComponentLoader] = useState(false);
  const [maxCount, setMaxCount] = useState(10);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeightCard);

  // all handle function
  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleFilterResetClick = () => {
    setValue(0);
    handleFilterClear();
  };
  const handleFilterClear = () => {
    setValue(0);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (value) => {
    setEntityTypeValue(value);
    getEntityList();
  };

  const getEntityList = async (entity_type = "", skipCount = 0, isScroll) => {
    setComponentLoader(true);
    setEntityData([]);
    setNoDataFound(false);

    var jsonData = {
      maxCount: maxCount + skipCount,
      entity_type: entity_type,
    };
    var config = {
      method: "post",
      url: API.API_GET_ENTITY_LIST,
      data: jsonData,
    };
    await axios(config)
      .then(function (response) {
        setComponentLoader(false);
        if (response.data.length) {
          setEntityData(response.data);
        } else {
          setNoDataFound(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleOnScroll = (event) => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
  };
  const handleEntityInfo = (entity_id) => {
    setNavTab(0)
    setValue(0);
    setInfoDataLoaded(false);
    if (!dataInfoLoaded) {
      notification.toast.warning("Please wait. Your Data is loading...!!");
      return false;
    }
    getDepartmentPeopleInfo(employee_id);
  };
  const renderUserImage = (fullName) => {
    return (
      <Avatar
        src="../../assets/images/default-userimage.png"
        className={classes.avt_large}
      />
    );
  };

  // all end handle function

  useEffect(() => {
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
  }, [reducerState.applicationData.caseTypes]);
  // all api call

  // end all api call
  return (
    <div className="page" id="application-type">
      <Grid container spacing={3}>
        <Grid item lg={3} md={4} xs={12} sm={12}>
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
              <Grid item lg={12} md={12} xs={12} sm={12}>
                <FormControl
                  variant="outlined"
                  className={classes.formControl + " " + classesBase.mb_one}
                >
                  <InputLabel id="demo-controlled-open-select-label">
                    Entity Types
                  </InputLabel>
                  <Select
                    className="input-dropdown"
                    name="employeeStatus"
                    label="EmployeeStatus"
                    value={entityDrpValue}
                    onChange={(e) => handleFilterChange(e.target.value)}
                  >
                    <MenuItem value="0">
                      <em>All</em>
                    </MenuItem>
                    {entityTypes?.length ? (
                      entityTypes.map((entityType) => (
                        <MenuItem
                          value={entityType.ID}
                          key={entityType.ENTITY_ID}
                        >
                          {entityType.ID}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">
                        <em>No Data Available</em>
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
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
            </Grid>
          </Popover>
          <div
            className={fixedHeightPaper}
            onScroll={(event) => handleOnScroll(event)}
          >
            <Box boxShadow={0} className="card bg-secondary" borderRadius={5}>
              {entityData.length ? (
                <>
                  {(props.componentLoader
                    ? Array.from(new Array(entityData.length))
                    : entityData
                  ).map((entity, index) => (
                    <Box key={index} width="100%">
                      {entity ? (
                        <Card
                          padding={0.5}
                          style={{ cursor: "pointer" }}
                          className={
                            entityData.length > 1
                              ? "card-user-case " + classes.mb_one
                              : "card-user-case"
                          }
                          onClick={() => {
                            
                              handleEntityInfo();
                            
                          }}
                        >
                          <CardHeader
                            avatar={renderUserImage(people.FULL_NAME)}
                            title={people.FULL_NAME}
                            subheader={people.DEPARTMENT_NAME}
                          />
                        </Card>
                      ) : (
                        <>
                          {props.noDataFound ? (
                            <div>No Peoples Found </div>
                          ) : (
                            <ComponentLoader type="rect" />
                          )}
                        </>
                      )}
                    </Box>
                  ))}
                </>
              ) : (
                <>
                  {props.componentLoader ? (
                    <>
                      {(props.componentLoader
                        ? Array.from(new Array(4))
                        : Array(2)
                      ).map((item, index) => (
                        <Box key={index} width="100%" padding={0.5}>
                          {item ? (
                            <img
                              style={{ width: "100%", height: 100 }}
                              alt={item.title}
                              src={item.src}
                            />
                          ) : (
                            <ComponentLoader type="rect" />
                          )}
                        </Box>
                      ))}
                    </>
                  ) : (
                    <div>No Peoples Found </div>
                  )}
                </>
              )}
            </Box>
          </div>
        </Grid>
        <Grid item lg={9} md={8} xs={12} sm={12}>
          <PeopleMainTab> </PeopleMainTab>
        </Grid>
      </Grid>
    </div>
  );
}
