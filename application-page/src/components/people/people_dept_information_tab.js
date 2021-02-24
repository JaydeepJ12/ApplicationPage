import React from "react";
import { Box, Grid, TextField } from "@material-ui/core";
import ComponentLoader from "../common/component-loader";
import { default as useStyles } from "../../assets/css/common_styles";

var dateFormat = require("dateformat");

function PeopleBasicInfoTab(props) {
  var classes = useStyles();

  return (
    <div className="page" id="people-information-tab">
      <Box boxShadow={0} className="card bg-secondary" borderRadius={5}>
        <Grid container>
          {!props.dataInfoLoaded ? (
            <>
              {props.noDataFound ? (
                <Grid item xs={12}>
                  No Information Found{" "}
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <ComponentLoader type="rect" />
                </Grid>
              )}
            </>
          ) : (
            <>
              <Grid item xs={6}>
                <form className={classes.form_root}>
                  <Grid container spacing={3}>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Display Name"
                        defaultValue={props.peopleInfo.FULL_NAME}
                        InputLabelProps={{
                          classes: {
                            root: classes.inputLabel,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Legal First Name"
                        defaultValue={props.peopleInfo.FIRST_NAME}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Legal Last Name"
                        defaultValue={props.peopleInfo.LAST_NAME}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Short User Name"
                        defaultValue={props.peopleInfo.SHORT_USER_NAME}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Job Title"
                        defaultValue={props.peopleInfo.JOB_TITLE}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Employee Type"
                        defaultValue={props.peopleInfo.EMPLOYEE_TYPE_NAME}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Office Street Address"
                        defaultValue={props.peopleInfo.STREET_ADDRESS}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Office State"
                        defaultValue={props.peopleInfo.STATE}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Office City"
                        defaultValue={props.peopleInfo.CITY}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Home Phone/Cell Number"
                        defaultValue={props.peopleInfo.HOME_PHONE_NUMBER}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Hire Date"
                        defaultValue={dateFormat(
                          props.peopleInfo.HIRE_DATE,
                          "m/dd/yyyy"
                        )}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Birth Date"
                        defaultValue={props.peopleInfo.BIRTH_DATE}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Gender"
                        defaultValue={
                          (props.peopleInfo.GENDER = "M" ? "Male" : "Female")
                        }
                      />
                    </Grid>
                  </Grid>
                </form>
              </Grid>
              <Grid item xs={6}>
                <form className={classes.form_root}>
                  <Grid container spacing={3}>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="(Preferred) Full Name"
                        defaultValue={props.peopleInfo.FULL_NAME}
                        InputLabelProps={{
                          classes: {
                            root: classes.inputLabel,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Email Address"
                        defaultValue={props.peopleInfo.EMAIL_ADDRESS}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Department Name"
                        defaultValue={props.peopleInfo.DEPARTMENT_NAME}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Office Zip Code"
                        defaultValue={props.peopleInfo.ZIP_CODE}
                      />
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </div>
  );
}
export default PeopleBasicInfoTab;
