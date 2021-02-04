import { Container, Grid } from "@material-ui/core";
import React from "react";
import ItemOverview from "./overview_items";
import PeopleOverview from "./overview_people";
import VisualOverview from "./overview_visual";

export default function OverView(props) {
  return (
    <div className="page" id="page-overview">
      <Container>
        <Grid container spacing={3}>
          <Grid item lg={12} md={12} xs={12} sm={12}>
            {/* <VisualOverview /> */}
          </Grid>
          <Grid item lg={6} md={6} xs={12} sm={12}>
            <PeopleOverview />
          </Grid>
          <Grid item lg={6} md={6} xs={12} sm={12}>
            <ItemOverview />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
