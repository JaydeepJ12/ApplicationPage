import { Avatar, Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import {
  default as useStyles
} from "../../assets/css/common_styles";
import ComponentLoader from "../../components/common/component-loader";
function BasicEntityInfo(props) {
  var classes = useStyles();

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
             
            </div>
          </Grid>
          <Grid item lg={8} md={9} xs={12} sm={12}>
            <Grid container spacing={1}>
              <Grid item lg={6} md={6} xs={12} sm={12} container>
                <Grid item lg={4} md={4} xs={4} sm={4}>
                  <Typography color={"primary"}>Entity Name: </Typography>
                </Grid>
                <Grid item lg={8} md={8} xs={8} sm={8}>
                  {" "}
                  <Typography>Dixit </Typography>
                </Grid>
                <Grid item lg={4} md={4} xs={4} sm={4}>
                  <Typography color={"primary"}>Create by: </Typography>
                </Grid>
                <Grid item lg={8} md={8} xs={8} sm={8}>
               
                </Grid>
                <Grid item lg={4} md={4} xs={4} sm={4}>
                  <Typography color={"primary"}>Created on </Typography>
                </Grid>
                <Grid item lg={8} md={8} xs={8} sm={8}>
                
                </Grid>
         
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
export default BasicEntityInfo;
