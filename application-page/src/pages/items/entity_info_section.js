import React, { useEffect, useState } from "react";
import {  Grid, Typography } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import useStyles from "../../assets/css/common_styles";
export default function EntityInfoBlock(props) {
  const classes = useStyles();

  return (
    <div className="page-entity-info" style={{ height: "100%", width: "100%" }}>
      <Grid container>
        {(!props.dataInfoLoaded
          ? Array.from(new Array(props.entityInfoData.length ? props.entityInfoData.length : 10))
          : props.entityInfoData
        ).map((option, index) => (
          <>
            {option ? (
              <>
                <Grid item lg={4} md={4} xs={12} sm={12} container>
                  <Grid item lg={5} md={5} xs={5} sm={5}>
                    <Typography
                      variant="h6"
                      color={"primary"}
                      gutterBottom
                      style={{ fontSize: ".9rem" }}
                    >
                      {option.NAME}
                    </Typography>{" "}
                  </Grid>
                  <Grid item lg={2} md={2} xs={2} sm={2}>
                    <Typography
                      variant="h6"
                      color={"primary"}
                      gutterBottom
                      style={{ fontSize: ".9rem" }}
                    >
                      :
                    </Typography>{" "}
                  </Grid>
                  <Grid item lg={5} md={5} xs={5} sm={5}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      style={{ fontSize: ".9rem" }}
                    >
                      {option.FIELD_VALUE ? option.FIELD_VALUE : "-"}
                    </Typography>{" "}
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <Grid item lg={4} md={4} xs={4} sm={4}>
                  <Grid container>
                    <Grid item lg={5} md={5} xs={5} sm={5}>
                      <Skeleton  className={classes.skeletonWidthEntity}/>
                    </Grid>
                    <Grid item lg={2} md={2} xs={2} sm={2}>
                      <div className="text-center">:</div>
                    </Grid>
                    <Grid item lg={5} md={5} xs={5} sm={5}>
                      <Skeleton  className={classes.skeletonWidthEntity} />
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
          </>
        ))}
      </Grid>
    </div>
  );
}
