import React, { useEffect, useState } from "react";
import {  Grid, Typography,TextField } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import useStyles from "../../assets/css/common_styles";
export default function EntityInfoBlock(props) {
  const classes = useStyles();

  return (
    <div className="page-entity-info" style={{ height: "100%", width: "100%" }}>
      <Grid container>
      <form className={classes.form_root+' MuiGrid-root MuiGrid-container'}>
        {(!props.dataInfoLoaded
          ? Array.from(new Array(props.entityInfoData.length ? props.entityInfoData.length : 10))
          : props.entityInfoData
        ).map((option, index) => (
          <>
            {option ? (
            <Grid item lg={4} md={4} xs={4} sm={4}>
                
                <TextField
                        disabled
                        id="outlined-disabled"
                        label={option.NAME}
                        value={option.FIELD_VALUE ? option.FIELD_VALUE : "-"}
                        InputLabelProps={{
                          classes: {
                            root: classes.inputLabel,
                          },
                        }}
                      />
              
              </Grid>
            ) : (
              <>
                <Grid item lg={4} md={4} xs={4} sm={4}>
                  <Grid container>
                    <Grid item lg={6} md={6} xs={6} sm={6}>
                      <Skeleton  className={classes.skeletonWidthEntity}/>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
          </>
        ))}
         </form>
      </Grid>
    </div>
  );
}
