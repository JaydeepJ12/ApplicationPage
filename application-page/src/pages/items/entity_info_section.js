import * as React from "react";
import { Box, Grid, Typography } from "@material-ui/core";

export default function EntityInfoBlock(props) {


  return (
    <div className="page-entity-info" style={{ height: "100%", width: "100%" }}>
      {props.entityInfoData ? (
        <Grid container spacing={1}>
          {props.entityInfoData
            ? props.entityInfoData.map((option) => (
                <Grid item lg={6} md={6} xs={12} sm={12} container>
                  <Grid item lg={5} md={5} xs={5} sm={5}>
                    <Typography variant="h6" color={"primary"} gutterBottom     style={{ fontSize: ".9rem"}}>
                      {option.NAME}
                    </Typography>{" "}
                   
                  </Grid>
                  <Grid item lg={2} md={2} xs={2} sm={2}>
                  <Typography variant="h6" color={"primary"} gutterBottom     style={{ fontSize: ".9rem"}}>
                     :
                    </Typography>{" "}
                  </Grid>
                  <Grid item lg={5} md={5} xs={5} sm={5}>
                  <Typography variant="h5" gutterBottom     style={{ fontSize: ".9rem"}}>
                  {option.FIELD_VALUE ? option.FIELD_VALUE : '-'}
                    </Typography>{" "}
                  
                  </Grid>
                </Grid>
              ))
            : []}
        </Grid>
      ) : null}
    </div>
  );
}
