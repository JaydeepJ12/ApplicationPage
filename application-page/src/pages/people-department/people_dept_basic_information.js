import { Box, Grid, Typography ,Link  } from "@material-ui/core";
import React, { useEffect } from "react";
import { default as useStyles } from "../../assets/css/common_styles";
import CommonAvatar from "../../components/common/avatar";
import ComponentLoader from "../../components/common/component-loader";
function PeopleBasicInfoTab(props) {
  var classes = useStyles();

  useEffect(() => {}, [props.peopleInfo]);

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
              {props.peopleInfo?.Display_name ? (
                <CommonAvatar
                  name={props.peopleInfo?.Display_name}
                  sizeClass={classes.avt_large}
                />
              ) : null}
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
                  <Typography>{props.peopleInfo?.Display_name}</Typography>
                </Grid>
                <Grid item lg={4} md={4} xs={4} sm={4}>
                  <Typography color={"primary"}>Job: </Typography>
                </Grid>
                <Grid item lg={8} md={8} xs={8} sm={8}>
                  {props.peopleInfo?.jobTitle}
                </Grid>
                <Grid item lg={4} md={4} xs={4} sm={4}>
                  <Typography color={"primary"}>Department: </Typography>
                </Grid>
                <Grid item lg={8} md={8} xs={8} sm={8}>
                  {props.peopleInfo.BasicName}
                </Grid>
                {props.peopleInfo?.EMAIL_ADDRESS ? (
                  <>
                    <Grid item lg={4} md={4} xs={4} sm={4}>
                      <Typography color={"primary"}>Email: </Typography>
                    </Grid>
                    <Grid item lg={8} md={8} xs={8} sm={8}>
                      <Typography>
                        {" "}
                        {props.peopleInfo?.EMAIL_ADDRESS}
                      </Typography>
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
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => {
                        props.getDepartmentPeopleList(
                          0,
                          {'employee_id': props.peopleInfo.manager_id},
                          0
                        );
                      }}
                    >
                      {
                        props.peopleInfo.MANAGER_LDAP_PATH.split("=")[1]?.split(
                          ","
                        )[0]
                      }
                    </Link>
                   
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
