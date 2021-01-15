import {
  
  Container,
} from "@material-ui/core";
import React, {useState} from "react";
import VisualOverview from './overview_visual'
import PeopleOverview from './overview_people'
import ItemOverview from './overview_items'



export default function OverView(props) {



  return (
    <div className="page" id="page-overview">
      <Container>

        <VisualOverview/>
        <PeopleOverview/>
        <ItemOverview/>
                

             
      </Container>
      </div>
  );
}
