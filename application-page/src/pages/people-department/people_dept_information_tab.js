import { Box, Grid, TextField } from "@material-ui/core";
import React, { useEffect } from "react";
import { default as useStyles } from "../../assets/css/common_styles";
import ComponentLoader from "../../components/common/component-loader";

var dateFormat = require("dateformat");

function PeopleBasicInfoTab(props) {
  var classes = useStyles();

  useEffect(() => {}, [props.peopleInfo]);

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
                        value={props.peopleInfo.Display_name}
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
                        value={props.peopleInfo.FIRST_NAME}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Legal Last Name"
                        value={props.peopleInfo.LAST_NAME}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Short User Name"
                        value={props.peopleInfo.SHORT_USER_NAME}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Job Title"
                        value={props.peopleInfo.JobTitle}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Employee Type"
                        value={props.peopleInfo.empType}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Office Street Address"
                        value={props.peopleInfo.OFFICE_LOCATION}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Office State"
                        value={props.peopleInfo.STATE}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Office City"
                        value={props.peopleInfo.CITY}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Home Phone/Cell Number"
                        value={props.peopleInfo.EmpCellPhone}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Hire Date"
                        value={dateFormat(
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
                        value={props.peopleInfo.BIRTH_DATE}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Gender"
                        value={
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
                        value={props.peopleInfo.Display_name}
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
                        value={props.peopleInfo.EMAIL_ADDRESS}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Department Name"
                        value={props.peopleInfo.BasicName}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} xs={12} sm={12}>
                      <TextField
                        disabled
                        id="outlined-disabled"
                        label="Office Zip Code"
                        value={props.peopleInfo.ZIP_CODE}
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
