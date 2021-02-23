import { Avatar, Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import {
  default as useStyles
} from "../../assets/css/common_styles";
import ComponentLoader from "../common/component-loader";
function PeopleBasicInfoTab(props) {
  var classes = useStyles();
  const renderPeopleImage = (UserName) => {
    if (UserName) {
      return (
        <Avatar
          error
          className={classes.ex_large}
          alt={UserName}
          src={process.env.REACT_APP_USER_ICON + UserName}
        />
      );
    } else {
      return (
        <Avatar
          error
          className={classes.ex_large}
          alt="Test"
          src={process.env.DEFAULT_IMAGE_PATH}
        />
      );
    }
  };
  return (
    <div className="page" id="people-basic-information">
      {!props.dataInfoLoaded ? (
        <Box boxShadow={0} className="card bg-secondary" borderRadius={5}>
          {props.noDataFound ? (
            <div>No Data Found </div>
          ) : (
            <ComponentLoader type="rect" />
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item lg={2} md={3} xs={12} sm={12}>
            <div
              className="top-section"
              style={{
                textAlign: "center",
                padding: "5px",
                borderRight: "2px solid #eeeeee",
              }}
            >
              {props.peopleInfo?.FULL_NAME
                ? renderPeopleImage(props.peopleInfo?.FULL_NAME)
                : null}
            </div>
          </Grid>
          <Grid item lg={8} md={9} xs={12} sm={12}>
            <Grid container spacing={1}>
              <Grid item lg={6} md={6} xs={12} sm={12} container>
                <Grid item lg={4} md={4} xs={4} sm={4}>
                  <Typography color={"primary"}>Name: </Typography>
                </Grid>
                <Grid item lg={8} md={8} xs={8} sm={8}>
                  {" "}
                  <Typography>{props.peopleInfo?.FULL_NAME}</Typography>
                </Grid>
                <Grid item lg={4} md={4} xs={4} sm={4}>
                  <Typography color={"primary"}>Job: </Typography>
                </Grid>
                <Grid item lg={8} md={8} xs={8} sm={8}>
                  {props.peopleInfo?.JOB_TITLE}
                </Grid>
                <Grid item lg={4} md={4} xs={4} sm={4}>
                  <Typography color={"primary"}>Department: </Typography>
                </Grid>
                <Grid item lg={8} md={8} xs={8} sm={8}>
                  {props.peopleInfo.DEPARTMENT_NAME}
                </Grid>
                {props.peopleInfo?.PHONE_NUMBER ? (
                  <>
                    <Grid item lg={4} md={4} xs={4} sm={4}>
                      <Typography color={"primary"}>Contact Info: </Typography>
                    </Grid>
                    <Grid item lg={8} md={8} xs={8} sm={8}>
                      <Typography> {props.peopleInfo?.PHONE_NUMBER}</Typography>
                    </Grid>
                  </>
                ) : null}

                <Grid item lg={4} md={4} xs={4} sm={4}>
                  <Typography color={"primary"}>Location: </Typography>
                </Grid>
                <Grid item lg={8} md={8} xs={8} sm={8}>
                  {" "}
                  <Typography>
                    {props.peopleInfo?.CITY + " " + props.peopleInfo?.STATE}{" "}
                  </Typography>
                </Grid>
                <Grid item lg={4} md={4} xs={4} sm={4}>
                  <Typography color={"primary"}>Manager: </Typography>
                </Grid>

                {props.peopleInfo.MANAGER_LDAP_PATH ? (
                  <Grid item lg={8} md={8} xs={8} sm={8}>
                    <Typography>
                      {
                        props.peopleInfo.MANAGER_LDAP_PATH.split("=")[1]?.split(
                          ","
                        )[0]
                      }
                    </Typography>
                  </Grid>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
export default PeopleBasicInfoTab;
